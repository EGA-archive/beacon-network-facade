import axios from "axios";
import React, { useState } from "react";
import "./App.css";
import { Col, Container, Row } from "react-bootstrap";
import ResultList from "./components/ResultList.js";
import Search from "./components/Search";
import { useAuth } from "oidc-react";
import Footer from "./components/Footer.js";
import NetworkMembers from "./components/NetworkMembers.js";
import CustomNavbar from "./components/CustomNavbar.js";
import config from "./config";

function App() {
  const [results, setResults] = useState([]);
  const [metaresults, setMetaResults] = useState([]);
  const [finalstart, setFinalStart] = useState([]);
  const [error, setError] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [queriedVariant, setQueriedVariant] = useState("");
  const auth = useAuth();

  const search = async (variant, genome) => {
    setLoading(true);
    let jsonData1 = {};
    var arr = variant.split("-");
    if (arr[2].length === 1) {
      var end = parseInt(arr[1]) + 1;
    } else {
      var end = parseInt(arr[1]) + arr[2].length;
    }
    var finalend = end.toString();
    var finalstart = parseInt(arr[1]);
    setFinalStart(finalstart);

    try {
      let metaresponse;
      metaresponse = await axios({
        method: "get",
        url: `${config.API_URL}`,
        headers: {
          "Content-Type": "application/json",
        },
        data: jsonData1,
      });
      setMetaResults(metaresponse.data.response);
      // console.log("This is my Metaresult", metaresponse.data.response);
    } catch (error) {
      console.error(error);
      setError(error);
    }
    try {
      jsonData1 = {
        meta: {
          apiVersion: "2.0",
        },
        query: {
          requestParameters: {
            alternateBases: arr[3],
            referenceBases: arr[2],
            start: arr[1],
            end: finalend,
            referenceName: arr[0],
          },
          filters: [],
          includeResultsetResponses: "HIT",
          pagination: {
            skip: 0,
            limit: 10,
          },
          testMode: false,
          requestedGranularity: "record",
        },
      };
      let response;

      if (auth && auth.userData) {
        // console.log(auth)
        response = await axios({
          method: "post",
          url: `${config.API_URL}/g_variants`,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.userData.access_token}`,
          },
          data: jsonData1,
        });
      } else {
        response = await axios({
          method: "get",
          url: `${config.API_URL}/g_variants?start=${arr[1]}&alternateBases=${arr[3]}&referenceBases=${arr[2]}&referenceName=${arr[0]}&assemblyId=${genome}`,
          headers: {
            "Content-Type": "application/json",
          },
          data: jsonData1,
        });
      }
      setResults(response.data.response.resultSets);
      // console.log("This is my resultSets", response.data.response.resultSets);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bigparent">
      <div className="parentwrapper">
        <CustomNavbar />
        <Container>
          <Row>
            <Search search={search} setVariant={setQueriedVariant} />{" "}
          </Row>
          {isLoading === true && error === false && (
            <div className="loader"></div>
          )}
          {isLoading === false && error === false && (
            <ResultList
              results={results}
              metaresults={metaresults}
              finalstart={finalstart}
              error={error}
              queriedVariant={queriedVariant}
            />
          )}
          {/* Show NetworkMembers only if no search results */}
          {!queriedVariant && <NetworkMembers />}
          {error !== false && (
            <ResultList
              results={results}
              metaresults={metaresults}
              finalstart={finalstart}
              error={error}
              // queriedVariant={queriedVariant}
            />
          )}
        </Container>
      </div>
      <Footer />
    </div>
  );
}

export default App;
