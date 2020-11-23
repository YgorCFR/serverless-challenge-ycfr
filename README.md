# serverless-challenge-ycfr
The repository that does the image management with AWS lamba functions

**Welcome to the serverless-challenge-ycfr**
# Important !
- Create an AWS account
- Once created, select the security credentials option(you can go to console and select the option "My Security options", at user icon).
- Generate 

# First step
- Clone the repository to your machine
# Second step
- At cmd, Install the serverless on your machine
```
npm install -g serverless
```
# Third step
- At cmd, Install the project dependencies
```
npm install 
```
# Fourth step
- At configs/generalConfigs.js, change the parameters
```
 aws : {
        accessKey: 'YOUR ACCESS KEY',
        secretKey: 'YOUR SECRET KEY',
        bucketName: 'YOUR BUCKET NAME'
 }
```
# Fifth step
- At serverless.yml, change the bucket name at custom field
```
custom:
  bucket:
    dev: 'YOUR DEV BUCKET NAME'
    prod: 'YOUR PRD BUCKET NAME'
```
# Sixth step
- At cmd, type the following command
```
serverless config credentials --provider aws --key YOUR_ACCESS_KEY --secret YOUR_SECRET_KEY
```
And type this command next:
```
serverless deploy
```
