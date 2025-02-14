from urllib.parse import urlencode
from urllib.request import urlopen
import json
from dotenv import load_dotenv
import os
from network.logs.logs import log_with_args, LOG
from network.conf.conf import level

@log_with_args(level)
def exchange_token(self, url, idp_token):
        with open('/network/auth/clients/clients_mapping.json') as clients_file:
                dict_clients = json.load(clients_file)
        try:
                #LOG.warning(url)
                #LOG.warning(idp_token)
                path_env="/network/auth/clients/"+dict_clients[url]
                load_dotenv(path_env, override=True)
                #LOG.warning(path_env)
                CLIENT_ID=os.getenv('CLIENT_ID')
                CLIENT_SECRET=os.getenv('CLIENT_SECRET')
                ISSUER=os.getenv('ISSUER')
                AUDIENCE=os.getenv('AUDIENCE')
                TOKEN_ENDPOINT=os.getenv('TOKEN_ENDPOINT')
                #LOG.warning(CLIENT_ID)
                #LOG.warning(CLIENT_SECRET)
                #LOG.warning(ISSUER)
                #LOG.warning(AUDIENCE)
                #LOG.warning(TOKEN_ENDPOINT)
                data = {'client_id': CLIENT_ID,
                        'client_secret': CLIENT_SECRET,
                        'subject_token': idp_token,
                        "subject_issuer": ISSUER,
                        'subject_token_type': 'urn:ietf:params:oauth:token-type:access_token',
                        'grant_type': 'urn:ietf:params:oauth:grant-type:token-exchange'}
        
                token_response = urlopen(TOKEN_ENDPOINT, urlencode(data).encode("utf-8"))
                token_response=token_response.read()
                token_response=json.loads(token_response)
                exchanged_token=token_response["access_token"]
                #LOG.warning(exchanged_token)
                internal_data = {'client_id': CLIENT_ID,
                        'client_secret': CLIENT_SECRET,
                        'subject_token': exchanged_token,
                        'subject_token_type': 'urn:ietf:params:oauth:token-type:access_token',
                        'audience': AUDIENCE,
                        'grant_type': 'urn:ietf:params:oauth:grant-type:token-exchange'}
                internal_token_response = urlopen(TOKEN_ENDPOINT, urlencode(internal_data).encode("utf-8"))
                internal_token_response=internal_token_response.read()
                internal_token_response=json.loads(internal_token_response)
                aud_exchanged_token=internal_token_response["access_token"]
                #LOG.warning(aud_exchanged_token)
        except Exception as e:
                LOG.warning(e)
                aud_exchanged_token='nothing'
        return aud_exchanged_token