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
                LOG.warning(url)
                LOG.warning(idp_token)
                path_env="/network/auth/clients/"+dict_clients[url]
                load_dotenv(path_env, override=True)
                LOG.warning(path_env)
                CLIENT_ID=os.getenv('CLIENT_ID')
                CLIENT_SECRET=os.getenv('CLIENT_SECRET')
                ISSUER=os.getenv('ISSUER')
                LOG.warning(CLIENT_ID)
                LOG.warning(CLIENT_SECRET)
                LOG.warning(ISSUER)
                data = {'client_id': CLIENT_ID,
                        'client_secret': CLIENT_SECRET,
                        'subject_token': idp_token,
                        "subject_issuer": ISSUER,
                        'subject_token_type': 'urn:ietf:params:oauth:token-type:access_token',
                        'grant_type': 'urn:ietf:params:oauth:grant-type:token-exchange'}
        
                token_response = urlopen('http://idp:8080/auth/realms/Beacon/protocol/openid-connect/token', urlencode(data).encode("utf-8"))
                token_response=token_response.read()
                token_response=json.loads(token_response)
                exchanged_token=token_response["access_token"]
        except Exception as e:
                LOG.warning(e)
                exchanged_token='nothing'
        LOG.warning(exchanged_token)
        return exchanged_token