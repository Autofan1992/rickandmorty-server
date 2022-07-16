import aws from 'aws-sdk'
import dotenv from 'dotenv'
import crypto from 'crypto'
import { promisify } from 'util'
const randomBytes = promisify(crypto.randomBytes)

dotenv.config()

const region = 'eu-central-1'
const bucketName = 'images-bucket-8'
const accessKeyId = process.env.AWS_ACCES_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

const s3 = new aws.S3({
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion: 'v4'
})

export async function generateUploadUrl() {
    const rawBytes = await randomBytes(16)
    const imageName = rawBytes.toString('hex')

    const params = {
        Bucket: bucketName,
        Key: imageName,
        Expires: 60
    }

    return await s3.getSignedUrlPromise('putObject', params)
}