import json
import boto3
import requests

def lambda_handler(event, context):

    print(event)
    query = event['queryStringParameters']['q']
    print(query)
    response = calling_lex(query)
    print(response)
    keywordone = response['slots']['firstkey']
    keywordtwo = response['slots']['secondkey']
    print("done")
    res = elastic(keywordone,keywordtwo)
    print(res)
    return {
        'statusCode': 200,
        'body': json.dumps(res),
    }

def calling_lex(query):

    client = boto3.client('lex-runtime')
    response = client.post_text(botName='SearchBot', botAlias='$LATEST', userId='USER', inputText=query)

    print(json.dumps(response))
    return response

def elastic(keywordone,keywordtwo):
    region = 'us-east-1'
    service = 'es'
    host = 'https://vpc-photosdomain-x3tnlit5updhdgvkvf3r2yhtqa.us-east-1.es.amazonaws.com/photosdomain/'  # the Amazon ES domain, including https://
    type = '_doc'

    url = host + '/_search'
    print(url)
    # Lambda execution starts here
    print(keywordtwo)
    print(keywordone)
    if keywordone == None:
        keywordone = ""
    if keywordtwo == None:
        keywordtwo = ""

    query = {
        "query": {
            "bool": {
                "should": [
                    {
                        "match": {
                            "labels": keywordone
                        }
                    },
                    {
                        "match": {
                            "labels": keywordtwo
                        }
                    }
                ]
            }
        }
    }

    headers = { "Content-Type": "application/json" }

    r = requests.get(url, headers=headers, data=json.dumps(query))
    data = (r.json())
    print("data")
    print(json.dumps(data))
    n = data["hits"]["total"]
    n = int(n)
    print(n)
    Photo = [dict() for x in range(n)]
    for i in range(n):
        bucket = data["hits"]["hits"][i]["_source"]['bucket']
        objectKey = data["hits"]["hits"][i]["_source"]['objectKey']
        labels = data["hits"]["hits"][i]["_source"]['labels']
        url = "https://s3.amazonaws.com/" + bucket + "/" + objectKey
        Photo[i]['url'] = url
        Photo[i]['labels'] = labels
        print(Photo)
    SearchResponse = {}
    SearchResponse['results'] = Photo
    print(SearchResponse)
    return SearchResponse
