import { SSTConfig } from "sst";
import { NextjsSite } from "sst/constructs";

import * as cdk from "aws-cdk-lib";

const ROOT_DOMAIN_NAME = "pchol.fr"; // Your domain name here
const DOMAIN_NAME = `sst.${ROOT_DOMAIN_NAME}`; // Any prefix you want, or just the root domain

export default {
  config(_input) {
    return {
      name: "my-app",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const hostedZone = new cdk.aws_route53.HostedZone(stack, "HostedZone", {
        zoneName: ROOT_DOMAIN_NAME,
      });
    
      const certificate = new cdk.aws_certificatemanager.Certificate(stack, "Certificate", {
        domainName: DOMAIN_NAME,
        validation: cdk.aws_certificatemanager.CertificateValidation.fromDns(hostedZone),
      });

      const site = new NextjsSite(stack, "site", {
        customDomain: {
          domainName: DOMAIN_NAME,
          cdk: {
            hostedZone,
            certificate,
          }
        }
      });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
