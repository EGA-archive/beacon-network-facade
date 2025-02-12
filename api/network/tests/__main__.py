from aiohttp.test_utils import TestClient, TestServer, loop_context
from aiohttp import web
from network.__main__ import Collection, Resultset, Info, ServiceInfo, Map, Configuration, FilteringTerms, EntryTypes, Registries
import json
import unittest

def create_app():
    app = web.Application()
    #app.on_startup.append(initialize)
    app.add_routes([web.post('/api', Info)])
    app.add_routes([web.post('/api/info', Info)])
    app.add_routes([web.post('/api/entry_types', EntryTypes)])
    app.add_routes([web.post('/api/service-info', ServiceInfo)])
    app.add_routes([web.post('/api/configuration', Configuration)])
    app.add_routes([web.post('/api/map', Map)])
    app.add_routes([web.post('/api/registries', Registries)])
    app.add_routes([web.post('/api/filtering_terms', FilteringTerms)])
    app.add_routes([web.post('/api/datasets', Collection)])
    app.add_routes([web.post('/api/datasets/{id}', Collection)])
    app.add_routes([web.post('/api/datasets/{id}/g_variants', Resultset)])
    app.add_routes([web.post('/api/datasets/{id}/biosamples', Resultset)])
    app.add_routes([web.post('/api/datasets/{id}/analyses', Resultset)])
    app.add_routes([web.post('/api/datasets/{id}/runs', Resultset)])
    app.add_routes([web.post('/api/datasets/{id}/individuals', Resultset)])
    app.add_routes([web.post('/api/cohorts', Collection)])
    app.add_routes([web.post('/api/cohorts/{id}', Collection)])
    app.add_routes([web.post('/api/cohorts/{id}/individuals', Resultset)])
    app.add_routes([web.post('/api/cohorts/{id}/g_variants', Resultset)])
    app.add_routes([web.post('/api/cohorts/{id}/biosamples', Resultset)])
    app.add_routes([web.post('/api/cohorts/{id}/analyses', Resultset)])
    app.add_routes([web.post('/api/cohorts/{id}/runs', Resultset)])
    app.add_routes([web.post('/api/g_variants', Resultset)])
    app.add_routes([web.post('/api/g_variants/{id}', Resultset)])
    app.add_routes([web.post('/api/g_variants/{id}/analyses', Resultset)])
    app.add_routes([web.post('/api/g_variants/{id}/biosamples', Resultset)])
    app.add_routes([web.post('/api/g_variants/{id}/individuals', Resultset)])
    app.add_routes([web.post('/api/g_variants/{id}/runs', Resultset)])
    app.add_routes([web.post('/api/individuals', Resultset)])
    app.add_routes([web.post('/api/individuals/{id}', Resultset)])
    app.add_routes([web.post('/api/individuals/{id}/g_variants', Resultset)])
    app.add_routes([web.post('/api/individuals/{id}/biosamples', Resultset)])
    app.add_routes([web.post('/api/analyses', Resultset)])
    app.add_routes([web.post('/api/analyses/{id}', Resultset)])
    app.add_routes([web.post('/api/analyses/{id}/g_variants', Resultset)])
    app.add_routes([web.post('/api/biosamples', Resultset)])
    app.add_routes([web.post('/api/biosamples/{id}', Resultset)])
    app.add_routes([web.post('/api/biosamples/{id}/g_variants', Resultset)])
    app.add_routes([web.post('/api/biosamples/{id}/analyses', Resultset)])
    app.add_routes([web.post('/api/biosamples/{id}/runs', Resultset)])
    app.add_routes([web.post('/api/runs', Resultset)])
    app.add_routes([web.post('/api/runs/{id}', Resultset)])
    app.add_routes([web.post('/api/runs/{id}/analyses', Resultset)])
    app.add_routes([web.post('/api/runs/{id}/g_variants', Resultset)])
    app.add_routes([web.get('/api', Info)])
    app.add_routes([web.get('/api/info', Info)])
    app.add_routes([web.get('/api/entry_types', EntryTypes)])
    app.add_routes([web.get('/api/service-info', ServiceInfo)])
    app.add_routes([web.get('/api/configuration', Configuration)])
    app.add_routes([web.get('/api/map', Map)])
    app.add_routes([web.get('/api/registries', Registries)])
    app.add_routes([web.get('/api/filtering_terms', FilteringTerms)])
    app.add_routes([web.get('/api/datasets', Collection)])
    app.add_routes([web.get('/api/datasets/{id}', Collection)])
    app.add_routes([web.get('/api/datasets/{id}/g_variants', Resultset)])
    app.add_routes([web.get('/api/datasets/{id}/biosamples', Resultset)])
    app.add_routes([web.get('/api/datasets/{id}/analyses', Resultset)])
    app.add_routes([web.get('/api/datasets/{id}/runs', Resultset)])
    app.add_routes([web.get('/api/datasets/{id}/individuals', Resultset)])
    app.add_routes([web.get('/api/cohorts', Collection)])
    app.add_routes([web.get('/api/cohorts/{id}', Collection)])
    app.add_routes([web.get('/api/cohorts/{id}/individuals', Resultset)])
    app.add_routes([web.get('/api/cohorts/{id}/g_variants', Resultset)])
    app.add_routes([web.get('/api/cohorts/{id}/biosamples', Resultset)])
    app.add_routes([web.get('/api/cohorts/{id}/analyses', Resultset)])
    app.add_routes([web.get('/api/cohorts/{id}/runs', Resultset)])
    app.add_routes([web.get('/api/g_variants', Resultset)])
    app.add_routes([web.get('/api/g_variants/{id}', Resultset)])
    app.add_routes([web.get('/api/g_variants/{id}/analyses', Resultset)])
    app.add_routes([web.get('/api/g_variants/{id}/biosamples', Resultset)])
    app.add_routes([web.get('/api/g_variants/{id}/individuals', Resultset)])
    app.add_routes([web.get('/api/g_variants/{id}/runs', Resultset)])
    app.add_routes([web.get('/api/individuals', Resultset)])
    app.add_routes([web.get('/api/individuals/{id}', Resultset)])
    app.add_routes([web.get('/api/individuals/{id}/g_variants', Resultset)])
    app.add_routes([web.get('/api/individuals/{id}/biosamples', Resultset)])
    app.add_routes([web.get('/api/analyses', Resultset)])
    app.add_routes([web.get('/api/analyses/{id}', Resultset)])
    app.add_routes([web.get('/api/analyses/{id}/g_variants', Resultset)])
    app.add_routes([web.get('/api/biosamples', Resultset)])
    app.add_routes([web.get('/api/biosamples/{id}', Resultset)])
    app.add_routes([web.get('/api/biosamples/{id}/g_variants', Resultset)])
    app.add_routes([web.get('/api/biosamples/{id}/analyses', Resultset)])
    app.add_routes([web.get('/api/biosamples/{id}/runs', Resultset)])
    app.add_routes([web.get('/api/runs', Resultset)])
    app.add_routes([web.get('/api/runs/{id}', Resultset)])
    app.add_routes([web.get('/api/runs/{id}/analyses', Resultset)])
    app.add_routes([web.get('/api/runs/{id}/g_variants', Resultset)])
    return app

class TestMain(unittest.TestCase):
    def test_main_check_slash_endpoint_is_working(self):
        with loop_context() as loop:
            app = create_app()
            client = TestClient(TestServer(app), loop=loop)
            loop.run_until_complete(client.start_server())
            async def test_check_slash_endpoint_is_working():
                resp = await client.get("/api")
                assert resp.status == 200
            loop.run_until_complete(test_check_slash_endpoint_is_working())
            loop.run_until_complete(client.close())
    def test_main_check_post_slash_endpoint_is_working(self):
        with loop_context() as loop:
            app = create_app()
            client = TestClient(TestServer(app), loop=loop)
            loop.run_until_complete(client.start_server())
            async def test_check_post_slash_endpoint_is_working():
                resp = await client.post("/api")
                assert resp.status == 200
            loop.run_until_complete(test_check_post_slash_endpoint_is_working())
            loop.run_until_complete(client.close())
    def test_main_check_info_endpoint_is_working(self):
        with loop_context() as loop:
            app = create_app()
            client = TestClient(TestServer(app), loop=loop)
            loop.run_until_complete(client.start_server())
            async def test_check_info_endpoint_is_working():
                resp = await client.get("/api/info")
                assert resp.status == 200
            loop.run_until_complete(test_check_info_endpoint_is_working())
            loop.run_until_complete(client.close())
    def test_main_check_post_info_endpoint_is_working(self):
        with loop_context() as loop:
            app = create_app()
            client = TestClient(TestServer(app), loop=loop)
            loop.run_until_complete(client.start_server())
            async def test_check_post_info_endpoint_is_working():
                resp = await client.post("/api/info")
                assert resp.status == 200
            loop.run_until_complete(test_check_post_info_endpoint_is_working())
            loop.run_until_complete(client.close())
    def test_main_check_service_info_endpoint_is_working(self):
        with loop_context() as loop:
            app = create_app()
            client = TestClient(TestServer(app), loop=loop)
            loop.run_until_complete(client.start_server())
            async def test_check_service_info_endpoint_is_working():
                resp = await client.get("/api/service-info")
                assert resp.status == 200
            loop.run_until_complete(test_check_service_info_endpoint_is_working())
            loop.run_until_complete(client.close())
    def test_main_check_post_service_info_endpoint_is_working(self):
        with loop_context() as loop:
            app = create_app()
            client = TestClient(TestServer(app), loop=loop)
            loop.run_until_complete(client.start_server())
            async def test_check_post_service_info_endpoint_is_working():
                resp = await client.post("/api/service-info")
                assert resp.status == 200
            loop.run_until_complete(test_check_post_service_info_endpoint_is_working())
            loop.run_until_complete(client.close())
    def test_main_check_entry_types_endpoint_is_working(self):
        with loop_context() as loop:
            app = create_app()
            client = TestClient(TestServer(app), loop=loop)
            loop.run_until_complete(client.start_server())
            async def test_check_entry_types_endpoint_is_working():
                resp = await client.get("/api/entry_types")
                assert resp.status == 200
            loop.run_until_complete(test_check_entry_types_endpoint_is_working())
            loop.run_until_complete(client.close())
    def test_main_check_post_entry_types_endpoint_is_working(self):
        with loop_context() as loop:
            app = create_app()
            client = TestClient(TestServer(app), loop=loop)
            loop.run_until_complete(client.start_server())
            async def test_check_post_entry_types_endpoint_is_working():
                resp = await client.post("/api/entry_types")
                assert resp.status == 200
            loop.run_until_complete(test_check_post_entry_types_endpoint_is_working())
            loop.run_until_complete(client.close())
    def test_main_check_configuration_endpoint_is_working(self):
        with loop_context() as loop:
            app = create_app()
            client = TestClient(TestServer(app), loop=loop)
            loop.run_until_complete(client.start_server())
            async def test_check_configuration_endpoint_is_working():
                resp = await client.get("/api/configuration")
                assert resp.status == 200
            loop.run_until_complete(test_check_configuration_endpoint_is_working())
            loop.run_until_complete(client.close())
    def test_main_check_post_configuration_endpoint_is_working(self):
        with loop_context() as loop:
            app = create_app()
            client = TestClient(TestServer(app), loop=loop)
            loop.run_until_complete(client.start_server())
            async def test_check_post_configuration_endpoint_is_working():
                resp = await client.post("/api/configuration")
                assert resp.status == 200
            loop.run_until_complete(test_check_post_configuration_endpoint_is_working())
            loop.run_until_complete(client.close())
    def test_main_check_map_endpoint_is_working(self):
        with loop_context() as loop:
            app = create_app()
            client = TestClient(TestServer(app), loop=loop)
            loop.run_until_complete(client.start_server())
            async def test_check_map_endpoint_is_working():
                resp = await client.get("/api/map")
                assert resp.status == 200
            loop.run_until_complete(test_check_map_endpoint_is_working())
            loop.run_until_complete(client.close())
    def test_main_check_post_map_endpoint_is_working(self):
        with loop_context() as loop:
            app = create_app()
            client = TestClient(TestServer(app), loop=loop)
            loop.run_until_complete(client.start_server())
            async def test_check_post_map_endpoint_is_working():
                resp = await client.post("/api/map")
                assert resp.status == 200
            loop.run_until_complete(test_check_post_map_endpoint_is_working())
            loop.run_until_complete(client.close())
    def test_main_check_filtering_terms_endpoint_is_working(self):
        with loop_context() as loop:
            app = create_app()
            client = TestClient(TestServer(app), loop=loop)
            loop.run_until_complete(client.start_server())
            async def test_check_filtering_terms_endpoint_is_working():
                resp = await client.get("/api/filtering_terms")
                assert resp.status == 200
            loop.run_until_complete(test_check_filtering_terms_endpoint_is_working())
            loop.run_until_complete(client.close())
    def test_main_check_post_filtering_terms_endpoint_is_working(self):
        with loop_context() as loop:
            app = create_app()
            client = TestClient(TestServer(app), loop=loop)
            loop.run_until_complete(client.start_server())
            async def test_check_post_filtering_terms_endpoint_is_working():
                resp = await client.post("/api/filtering_terms")
                assert resp.status == 200
            loop.run_until_complete(test_check_post_filtering_terms_endpoint_is_working())
            loop.run_until_complete(client.close())
    def test_main_check_datasets_endpoint_is_working(self):
        with loop_context() as loop:
            app = create_app()
            client = TestClient(TestServer(app), loop=loop)
            loop.run_until_complete(client.start_server())
            async def test_check_datasets_endpoint_is_working():
                resp = await client.get("/api/datasets")
                assert resp.status == 200
            loop.run_until_complete(test_check_datasets_endpoint_is_working())
            loop.run_until_complete(client.close())
    def test_main_check_post_datasets_endpoint_is_working(self):
        with loop_context() as loop:
            app = create_app()
            client = TestClient(TestServer(app), loop=loop)
            loop.run_until_complete(client.start_server())
            async def test_check_post_datasets_endpoint_is_working():
                resp = await client.post("/api/datasets")
                assert resp.status == 200
            loop.run_until_complete(test_check_post_datasets_endpoint_is_working())
            loop.run_until_complete(client.close())
    def test_main_check_individuals_endpoint_is_working(self):
        with loop_context() as loop:
            app = create_app()
            client = TestClient(TestServer(app), loop=loop)
            loop.run_until_complete(client.start_server())
            async def test_check_individuals_endpoint_is_working():
                resp = await client.post("/api/individuals")
                assert resp.status == 200
            loop.run_until_complete(test_check_individuals_endpoint_is_working())
            loop.run_until_complete(client.close())
    def test_main_check_cohorts_endpoint_is_working(self):
        with loop_context() as loop:
            app = create_app()
            client = TestClient(TestServer(app), loop=loop)
            loop.run_until_complete(client.start_server())
            async def test_check_cohorts_endpoint_is_working():
                resp = await client.get("/api/cohorts")
                assert resp.status == 200
            loop.run_until_complete(test_check_cohorts_endpoint_is_working())
            loop.run_until_complete(client.close())

    def test_main_check_datasets_with_limit_endpoint_is_working(self):
        with loop_context() as loop:
            app = create_app()
            client = TestClient(TestServer(app), loop=loop)
            loop.run_until_complete(client.start_server())
            async def test_check_datasets_with_limit_endpoint_is_working():
                resp = await client.get("/api/datasets?limit=200")
                assert resp.status == 200
            loop.run_until_complete(test_check_datasets_with_limit_endpoint_is_working())
            loop.run_until_complete(client.close())
    def test_main_check_g_variants_with_limit_endpoint_is_working(self):
        with loop_context() as loop:
            app = create_app()
            client = TestClient(TestServer(app), loop=loop)
            loop.run_until_complete(client.start_server())
            async def test_check_g_variants_with_limit_endpoint_is_working():
                resp = await client.get("/api/g_variants?limit=200")
                assert resp.status == 200
            loop.run_until_complete(test_check_g_variants_with_limit_endpoint_is_working())
            loop.run_until_complete(client.close())

    def test_main_check_g_variants_endpoint_ALL_resultSetResponse_is_working(self):
        with loop_context() as loop:
            app = create_app()
            client = TestClient(TestServer(app), loop=loop)
            loop.run_until_complete(client.start_server())
            async def test_check_g_variants_endpoint_ALL_resultSetResponse_is_working():
                resp = await client.get("/api/g_variants?includeResultsetResponses=ALL")
                assert resp.status == 200
            loop.run_until_complete(test_check_g_variants_endpoint_ALL_resultSetResponse_is_working())
            loop.run_until_complete(client.close())
    def test_main_check_g_variants_sequence_query(self):
        with loop_context() as loop:
            app = create_app()
            client = TestClient(TestServer(app), loop=loop)
            loop.run_until_complete(client.start_server())
            async def test_check_g_variants_endpoint_with_parameters_is_working():
                resp = await client.get("/api/g_variants?start=43045703&referenceName=17&assemblyId=GRCh38&referenceBases=G&alternateBases=A")
                assert resp.status == 200
            loop.run_until_complete(test_check_g_variants_endpoint_with_parameters_is_working())
            loop.run_until_complete(client.close())
    def test_main_check_g_variants_bracket_query(self):
        with loop_context() as loop:
            app = create_app()
            client = TestClient(TestServer(app), loop=loop)
            loop.run_until_complete(client.start_server())
            async def test_check_g_variants_endpoint_with_parameters_is_working():
                resp = await client.get("/api/g_variants?start=43045703,43045704&end=43045704,43045705&referenceName=17&assemblyId=GRCh38")
                assert resp.status == 200
            loop.run_until_complete(test_check_g_variants_endpoint_with_parameters_is_working())
            loop.run_until_complete(client.close())
    def test_main_check_registries(self):
        with loop_context() as loop:
            app = create_app()
            client = TestClient(TestServer(app), loop=loop)
            loop.run_until_complete(client.start_server())
            async def test_check_registries_is_working():
                resp = await client.get("/api/registries")
                assert resp.status == 200
            loop.run_until_complete(test_check_registries_is_working())
            loop.run_until_complete(client.close())
    def test_main_check_post_registries(self):
        with loop_context() as loop:
            app = create_app()
            client = TestClient(TestServer(app), loop=loop)
            loop.run_until_complete(client.start_server())
            async def test_check_registries_is_working():
                resp = await client.post("/api/registries")
                assert resp.status == 200
            loop.run_until_complete(test_check_registries_is_working())
            loop.run_until_complete(client.close())


if __name__ == '__main__':
    unittest.main()