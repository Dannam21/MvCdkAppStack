import { Stack, StackProps, Duration, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';

export class MvCdkAppStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'MyVpc', {
      maxAzs: 3
    });

    const role = iam.Role.fromRoleArn(this, 'LabRole', 'arn:aws:iam::020554080627:role/LabRole');

    const machineImage = ec2.MachineImage.genericLinux({
      'us-east-1': 'ami-0aa28dab1f2852040'
    });
    const instanceType = ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO);

    const securityGroup = new ec2.SecurityGroup(this, 'MySecurityGroup', {
      vpc: vpc,
      description: 'Allow SSH and HTTP access', 
      allowAllOutbound: true
    });
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'Permitir acceso SSH');
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'Permitir acceso HTTP');

    const instance = new ec2.Instance(this, 'EC2Instance', {
      instanceType: instanceType,
      machineImage: machineImage,
      vpc: vpc,
      role: role,
      securityGroup: securityGroup,
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      keyName: 'vockey', 
      blockDevices: [
        {
          deviceName: '/dev/sda1',
          volume: ec2.BlockDeviceVolume.ebs(20) 
        }
      ],
    });

    const userData = ec2.UserData.custom(`
      #!/bin/bash
      cd /var/www/html/
      git clone https://github.com/utec-cc-2024-2-test/websimple.git
      git clone https://github.com/utec-cc-2024-2-test/webplantilla.git
      ls -l
    `);
    instance.addUserData(userData.render());

    new CfnOutput(this, 'InstanceId', {
      value: instance.instanceId,
      description: 'ID de la instancia EC2'
    });

    new CfnOutput(this, 'InstancePublicIP', {
      value: instance.instancePublicIp,
      description: 'IP pública de la instancia'
    });

    new CfnOutput(this, 'websimpleURL', {
      value: `http://${instance.instancePublicIp}/websimple`,
      description: 'URL de websimple'
    });

    new CfnOutput(this, 'webplantillaURL', {
      value: `http://${instance.instancePublicIp}/webplantilla`,
      description: 'URL de webplantilla'
    });
    
  }
}
