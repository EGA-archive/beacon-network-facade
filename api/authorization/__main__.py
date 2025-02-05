from urllib.parse import urlencode
from urllib.request import urlopen
import json

def get_token(self, idp_token):
    data = {'client_id': 'beacon',
            'subject_token': idp_token,
            "subject_issuer": 'keycloak-oidc',
            'subject_token_type': 'urn:ietf:params:oauth:token-type:access_token',
            'grant_type': 'urn:ietf:params:oauth:grant-type:token-exchange'}

    token_response = urlopen('http://localhost:8080/auth/realms/Beacon/protocol/openid-connect/token', urlencode(data).encode("utf-8"))
    token_response=token_response.read()
    token_response=json.loads(token_response)
    exchanged_token=token_response["access_token"]
    return exchanged_token