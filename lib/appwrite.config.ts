import * as sdk from 'node-appwrite'

export const {
    NEXT_PUBLIC_PROJECT_ID: PROJECT_ID,
    NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
    NEXT_PUBLIC_APPWRITE_ENDPOINT: ENDPOINT
} = process.env

const client = new sdk.Client()

client
    .setEndpoint(ENDPOINT!)
    .setProject(PROJECT_ID!)
    
export const storage = new sdk.Storage(client)