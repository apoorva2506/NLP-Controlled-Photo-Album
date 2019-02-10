
import json
import boto3
import requests
# from requests_aws4auth import AWS4Auth

def lambda_handler(event, context):
    print(event)
    query = event["Records"]
    bucketName = query[0]["s3"]["bucket"]["name"]
    objectKey = query[0]["s3"]["object"]["key"]
    eventTime = query[0]["eventTime"]
    print(objectKey)
    client = boto3.client('rekognition')
    # response = client.detect_labels(
    # Image={
    #     'S3Object': {
    #         'Bucket': bucketName,
    #         'Name': objectKey
    #     }
    # },
    # MaxLabels=123
    # )

    response = client.detect_labels(Image={'S3Object':{'Bucket':bucketName,'Name':objectKey}})
    print("here")
    headers :{"Content-Type":"application/json"}
    url = "https://vpc-photosdomain-x3tnlit5updhdgvkvf3r2yhtqa.us-east-1.es.amazonaws.com/photosdomain/0"
    # r = requests.get(url, headers=headers, data=json.dumps(SearchResponse))
    try:
        data = {}
        data['objectKey'] = objectKey
        data['bucket'] = bucketName
        data['createdTimestamp'] = eventTime
        data['labels'] = []
        print("her")
        for label in response['Labels']:
            print (label['Name'] + ' : ' + str(label['Confidence']))
            data['labels'].append(label['Name'])
        json_data = json.dumps(data)
        headers = { "Content-Type": "application/json" }
        r = requests.post(url = url, data = json_data, headers = headers)
    except Exception as e:
        print("Error "+ str(e))

    # return (json.dumps(SearchResponse))
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
