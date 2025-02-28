from aiohttp.test_utils import TestClient, TestServer, loop_context
import unittest
import os
import jwt
from aiohttp import web
from network.auth.__main__ import exchange_token
from dotenv import load_dotenv

# for keycloak, create aud in mappers, with custom, aud and beacon for audience
mock_access_token = ""
mock_access_token_false = 'nothing'
#dummy test anonymous
#dummy test login
#add test coverage
#audit --> agafar informació molt específica que ens interessa guardar per sempre (de quins individuals ha obtingut resultats positius)

def create_test_app():
    app = web.Application()
    #app.on_startup.append(initialize)
    return app

class TestAuthN(unittest.TestCase):
    def __init__(self, methodName: str = "runTest") -> None:
        super().__init__(methodName)
        self._id = 'test'
    def test_exchange_token(self):
        with loop_context() as loop:
            app = create_test_app()
            client = TestClient(TestServer(app), loop=loop)
            loop.run_until_complete(client.start_server())
            async def test_exchange():
                aud_exchanged_token = exchange_token(self, 'https://af-ega-beacon-demo.ega-archive.org/api', mock_access_token)
            loop.run_until_complete(test_exchange())
            loop.run_until_complete(client.close())
    def test_exchange_invalid_token(self):
        with loop_context() as loop:
            app = create_test_app()
            client = TestClient(TestServer(app), loop=loop)
            loop.run_until_complete(client.start_server())
            async def test_exchange():
                aud_exchanged_token = exchange_token(self, 'https://af-ega-beacon-demo.ega-archive.org/api', mock_access_token_false)
                assert aud_exchanged_token=='nothing'
            loop.run_until_complete(test_exchange())
            loop.run_until_complete(client.close())
if __name__ == '__main__':
    unittest.main()# pragma: no cover