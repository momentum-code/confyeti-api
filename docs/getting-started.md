# Getting Started with Development
You'll need to do the following to get your local environment setup for development.

## Software Needed
- Git [Site](https://git-scm.com/)
- Node [Site](https://nodejs.org/en/)
- AWS CLI V2 [Site](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2-windows.html)
- 7-Zip [Site](https://www.7-zip.org/)
- Powershell (*included with Windows*)
- Your development IDE of choice

## Initial Setup
1. Clone the confyeti-api repo to your local machine
    - ```git clone https://github.com/momentum-code/confyeti-api.git```
1. Run ```npm install``` on the common-modules and shared-functions packages
1. Open a Powershell window as an administrator and execute the *pre-dev.ps1* script found in the root of the repo.
1. Open a command prompt and run ```aws2 configure --profile confyeti```. The following should be entered at the corresponding prompts:
    - AWS Access Key ID: *provided by Momentum*
    - AWS Secret Access Key: *provided by Momentum*
    - Default region name: us-east-1
    - Default output format: json

## Development Flow
Each package in this repo is setup with NPM scripts that do most of the work for you when you need to deploy to AWS.

### Shared Packages
The common-modules and shared-functions packages are there to house shared code used across the various API packages.

#### common-modules
The common-modules package serves as the default node_modules location for the other API packages. It takes advantage of Amazon's lambda layer functionality to serve as a single location for any node modules needed across the API.
- If you need to add an NPM package, run the necessary NPM install command within this package.
- To deploy the updated package, execute ```npm run deploy``` from the *common-modules/nodejs* directory

#### shared-functions
The shared-functions takes advantage of the same AWS functionality to house common functionality needed in multiple places throughout the API. It follows a similar development flow.
- Update the *index.js* file with the functionality you'd like to share.
- Add/update any necessary tests and execute ```npm run test``` to make sure you didn't f-ck anything up.
- Execute ```npm run deploy``` from the *shared-functions* directory root.

### API Packages
Each API package is setup with a specific structure to mimic the AWS lambda environment. The *pre-dev.ps1* script you ran earlier creates [directory junctions](https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/mklink) in each API package directory so that each shares the same *node_modules* and *opt* directories. This allows for a consistent experience when testing the app locally and in the cloud.

> **Note**: The *opt* directory is the convention used by AWS when creating custom layers. [More info](https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html)

Each package follows the same pattern used by the shared packages with an extra pre-deploy step to ensure compatibility when deploying to the AWS environment. 
- Update the *index.js* file with your changes.
- Add/update any necessary tests and execute ```npm run test``` to make sure you didn't f-ck anything up.
- Execute ```npm run deploy``` from the package's directory root.

<hr>

&copy; 2020 - Momentum Code