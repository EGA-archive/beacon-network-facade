import conf

def get_entry_types_map():
    map_analysis= {
                    "entryType": "analysis",
                    "openAPIEndpointsDefinition": "https://raw.githubusercontent.com/ga4gh-beacon/beacon-v2/main/models/json/beacon-v2-default-model/analyses/endpoints.json",
                    "rootUrl": conf.uri + "analyses",
                    "filteringTermsUrl": conf.uri + "analyses/filtering_terms",
                }
    analysis_single=conf.uri + "analyses/{id}"
    analysis_genomicVariant={
                            "returnedEntryType": "genomicVariant",
                            "url": conf.uri + "analyses/{id}/g_variants"
                        }
    map_biosample= {
                    "entryType": "biosample",
                    "openAPIEndpointsDefinition": "https://raw.githubusercontent.com/ga4gh-beacon/beacon-v2/main/models/json/beacon-v2-default-model/biosamples/endpoints.json",
                    "rootUrl": conf.uri + "biosamples",
                    "filteringTermsUrl": conf.uri + "biosamples/filtering_terms",
                }
    biosample_single=conf.uri + "biosamples/{id}"
    biosample_analysis={
                            "returnedEntryType": "analysis",
                            "url": conf.uri + "biosamples/{id}/analyses"
                        }
    biosample_genomicVariant={
                            "returnedEntryType": "genomicVariant",
                            "url": conf.uri + "biosamples/{id}/g_variants"
                        }
    biosample_run={
                            "returnedEntryType": "run",
                            "url": conf.uri + "biosamples/{id}/runs"
                        }
    map_cohort= {
                    "entryType": "cohort",
                    "openAPIEndpointsDefinition": "https://raw.githubusercontent.com/ga4gh-beacon/beacon-v2/main/models/json/beacon-v2-default-model/cohorts/endpoints.json",
                    "rootUrl": conf.uri + "cohorts",
                    "filteringTermsUrl": conf.uri + "cohorts/filtering_terms",
                }
    cohort_single=conf.uri + "cohorts/{id}"
    cohort_analysis={
                            "returnedEntryType": "analysis",
                            "url": conf.uri + "cohorts/{id}/analyses"
                        }
    cohort_individual={
                            "returnedEntryType": "individual",
                            "url": conf.uri + "cohorts/{id}/individuals"
                        }
    cohort_run={
                            "returnedEntryType": "run",
                            "url": conf.uri + "cohorts/{id}/runs"
                        }
    map_dataset= {
                    "entryType": "dataset",
                    "openAPIEndpointsDefinition": "https://raw.githubusercontent.com/ga4gh-beacon/beacon-v2/main/models/json/beacon-v2-default-model/datasets/endpoints.json",
                    "rootUrl": conf.uri + "datasets",
                    "filteringTermsUrl": conf.uri + "datasets/filtering_terms",
                }
    dataset_single=conf.uri + "datasets/{id}"
    dataset_analysis={
                            "returnedEntryType": "analysis",
                            "url": conf.uri + "datasets/{id}/analyses"
                        }
    dataset_biosample={
                            "returnedEntryType": "biosample",
                            "url": conf.uri + "datasets/{id}/biosamples"
                        }
    dataset_genomicVariant={
                            "returnedEntryType": "genomicVariant",
                            "url": conf.uri + "datasets/{id}/g_variants"
                        }
    dataset_individual={
                            "returnedEntryType": "individual",
                            "url": conf.uri + "datasets/{id}/individuals"
                        }
    dataset_run={
                            "returnedEntryType": "run",
                            "url": conf.uri + "datasets/{id}/runs"
                        }
    map_genomicVariant= {
                    "entryType": "genomicVariant",
                    "openAPIEndpointsDefinition": "https://raw.githubusercontent.com/ga4gh-beacon/beacon-v2/main/models/json/beacon-v2-default-model/genomicVariations/endpoints.json",
                    "rootUrl": conf.uri + "g_variants",
                    "filteringTermsUrl": conf.uri + "individuals/g_variants",
                }
    genomicVariant_single=conf.uri + "g_variants/{variantInternalId}"
    genomicVariant_analysis={
                            "returnedEntryType": "analysis",
                            "url": conf.uri + "g_variants/{variantInternalId}/analyses"
                        }
    genomicVariant_biosample={
                            "returnedEntryType": "biosample",
                            "url": conf.uri + "g_variants/{variantInternalId}/biosamples"
                        }
    genomicVariant_individual={
                            "returnedEntryType": "individual",
                            "url": conf.uri + "g_variants/{variantInternalId}/individuals"
                        }
    genomicVariant_run={
                            "returnedEntryType": "run",
                            "url": conf.uri + "g_variants/{variantInternalId}/runs"
                        }
    map_individual = {
                    "entryType": "individual",
                    "openAPIEndpointsDefinition": "https://raw.githubusercontent.com/ga4gh-beacon/beacon-v2/main/models/json/beacon-v2-default-model/individuals/endpoints.json",
                    "rootUrl": conf.uri + "individuals",
                    "filteringTermsUrl": conf.uri + "individuals/filtering_terms",
                }
    individual_single=conf.uri + "individuals/{id}"
    individual_analysis={
                            "returnedEntryType": "analysis",
                            "url": conf.uri + "individuals/{id}/analyses"
                        }
    individual_biosample={
                            "returnedEntryType": "biosample",
                            "url": conf.uri + "individuals/{id}/biosamples"
                        }
    individual_genomicVariant={
                            "returnedEntryType": "genomicVariant",
                            "url": conf.uri + "individuals/{id}/g_variants"
                        }
    individual_run={
                            "returnedEntryType": "run",
                            "url": conf.uri + "individuals/{id}/runs"
                        }
    map_run = {
                    "entryType": "run",
                    "openAPIEndpointsDefinition": "https://raw.githubusercontent.com/ga4gh-beacon/beacon-v2/main/models/json/beacon-v2-default-model/runs/endpoints.json",
                    "rootUrl": conf.uri + "runs",
                    "filteringTermsUrl": conf.uri + "runs/filtering_terms"
                }
    run_single=conf.uri + "runs/{id}"
    run_analysis={
                            "returnedEntryType": "analysis",
                            "url": conf.uri + "runs/{id}/analyses"
                        }
    run_genomicVariant= {
                            "returnedEntryType": "genomicVariant",
                            "url": conf.uri + "runs/{id}/g_variants"
                        }



    map_entry_types={}
    map_entry_types["endpointSets"]={}
    analyses_endpoints={}
    map_analysis["singleEntryUrl"]=analysis_single
    analyses_endpoints["genomicVariant"]=analysis_genomicVariant
    map_analysis["endpoints"]={}
    map_analysis["endpoints"]=analyses_endpoints
    map_entry_types["endpointSets"]["analysis"]=map_analysis
    biosamples_endpoints={}
    map_biosample["singleEntryUrl"]=biosample_single
    biosamples_endpoints["genomicVariant"]=biosample_genomicVariant
    try:
        map_biosample["endpoints"]["genomicVariant"]=biosamples_endpoints
    except Exception:
        map_biosample["endpoints"]={}
        map_biosample["endpoints"]=biosamples_endpoints
    biosamples_endpoints["analysis"]=biosample_analysis
    map_biosample["endpoints"]=biosamples_endpoints
    map_biosample["endpoints"]={}
    map_biosample["endpoints"]=biosamples_endpoints
    biosamples_endpoints["run"]=biosample_run
    try:
        map_biosample["endpoints"]=biosamples_endpoints
    except Exception:
        map_biosample["endpoints"]={}
        map_biosample["endpoints"]=biosamples_endpoints
    map_entry_types["endpointSets"]["biosample"]=map_biosample
    cohorts_endpoints={}
    map_cohort["singleEntryUrl"]=cohort_single
    cohorts_endpoints["individual"]=cohort_individual
    try:
        map_cohort["endpoints"]=cohorts_endpoints
    except Exception:
        map_cohort["endpoints"]={}
        map_cohort["endpoints"]=cohorts_endpoints
    cohorts_endpoints["analysis"]=cohort_analysis
    try:
        map_cohort["endpoints"]=cohorts_endpoints
    except Exception:
        map_cohort["endpoints"]={}
        map_cohort["endpoints"]=cohorts_endpoints
    cohorts_endpoints["run"]=cohort_run
    try:
        map_cohort["endpoints"]=cohorts_endpoints
    except Exception:
        map_cohort["endpoints"]={}
        map_cohort["endpoints"]=cohorts_endpoints
    map_entry_types["endpointSets"]["cohort"]=map_cohort
    datasets_endpoints={}
    map_dataset["singleEntryUrl"]=dataset_single# pragma: no cover
    datasets_endpoints["individual"]=dataset_individual
    try:
        map_dataset["endpoints"]=datasets_endpoints
    except Exception:
        map_dataset["endpoints"]={}
        map_dataset["endpoints"]=datasets_endpoints
    datasets_endpoints["analysis"]=dataset_analysis
    try:
        map_dataset["endpoints"]=datasets_endpoints
    except Exception:
        map_dataset["endpoints"]={}
        map_dataset["endpoints"]=datasets_endpoints
    datasets_endpoints["run"]=dataset_run
    try:
        map_dataset["endpoints"]=datasets_endpoints
    except Exception:
        map_dataset["endpoints"]={}
        map_dataset["endpoints"]=datasets_endpoints
    datasets_endpoints["biosample"]=dataset_biosample
    try:
        map_dataset["endpoints"]=datasets_endpoints
    except Exception:
        map_dataset["endpoints"]={}
        map_dataset["endpoints"]=datasets_endpoints
    datasets_endpoints["genomicVariant"]=dataset_genomicVariant
    try:
        map_dataset["endpoints"]=datasets_endpoints
    except Exception:
        map_dataset["endpoints"]={}
        map_dataset["endpoints"]=datasets_endpoints
    map_entry_types["endpointSets"]["dataset"]=map_dataset
    g_variants_endpoints={}
    map_genomicVariant["singleEntryUrl"]=genomicVariant_single
    g_variants_endpoints["individual"]=genomicVariant_individual
    try:
        map_genomicVariant["endpoints"]=g_variants_endpoints
    except Exception:
        map_genomicVariant["endpoints"]={}
        map_genomicVariant["endpoints"]=g_variants_endpoints
    g_variants_endpoints["analysis"]=genomicVariant_analysis
    try:
        map_genomicVariant["endpoints"]=g_variants_endpoints
    except Exception:
        map_genomicVariant["endpoints"]={}
        map_genomicVariant["endpoints"]=g_variants_endpoints
    g_variants_endpoints["run"]=genomicVariant_run
    try:
        map_genomicVariant["endpoints"]=g_variants_endpoints
    except Exception:
        map_genomicVariant["endpoints"]={}
        map_genomicVariant["endpoints"]=g_variants_endpoints
    g_variants_endpoints["biosample"]=genomicVariant_biosample
    try:
        map_genomicVariant["endpoints"]=g_variants_endpoints
    except Exception:
        map_genomicVariant["endpoints"]={}
        map_genomicVariant["endpoints"]=g_variants_endpoints
    map_entry_types["endpointSets"]["genomicVariant"]=map_genomicVariant
    individuals_endpoints={}
    map_individual["singleEntryUrl"]=individual_single
    individuals_endpoints["genomicVariant"]=individual_genomicVariant
    try:
        map_individual["endpoints"]=individuals_endpoints
    except Exception:
        map_individual["endpoints"]={}
        map_individual["endpoints"]=individuals_endpoints
    individuals_endpoints["analysis"]=individual_analysis
    try:
        map_individual["endpoints"]=individuals_endpoints
    except Exception:
        map_individual["endpoints"]={}
        map_individual["endpoints"]=individuals_endpoints
    individuals_endpoints["run"]=individual_run
    try:
        map_individual["endpoints"]=individuals_endpoints
    except Exception:
        map_individual["endpoints"]={}
        map_individual["endpoints"]=individuals_endpoints
    individuals_endpoints["biosample"]=individual_biosample
    try:
        map_individual["endpoints"]=individuals_endpoints
    except Exception:
        map_individual["endpoints"]={}
        map_individual["endpoints"]=individuals_endpoints
    map_entry_types["endpointSets"]["individual"]=map_individual
    runs_endpoints={}
    map_run["singleEntryUrl"]=run_single
    runs_endpoints["genomicVariant"]=run_genomicVariant
    try:
        map_run["endpoints"]=runs_endpoints
    except Exception:
        map_run["endpoints"]={}
        map_run["endpoints"]=runs_endpoints
    runs_endpoints["analysis"]=run_analysis
    try:
        map_run["endpoints"]=runs_endpoints
    except Exception:
        map_run["endpoints"]={}
        map_run["endpoints"]=runs_endpoints
    map_entry_types["endpointSets"]["run"]=map_run

    meta = {
        '$schema': 'https://raw.githubusercontent.com/ga4gh-beacon/beacon-framework-v2/main/responses/sections/beaconInformationalResponseMeta.json',
        'beaconId': conf.beaconId,
        'apiVersion': 'v2.0.0',
        'returnedSchemas': []
    }

    map_entry_types['$schema'] ='https://raw.githubusercontent.com/ga4gh-beacon/beacon-framework-v2/main/configuration/beaconMapSchema.json'

    beacon_map_json = {
        'meta': meta,
        'response': map_entry_types
    }


    return beacon_map_json
