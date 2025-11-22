/**
=========================================================
* Soft UI Dashboard PRO React - v4.0.2
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-pro-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";

// Soft UI Dashboard PRO React components
import SoftBox from "components/soft-box";
import SoftTypography from "components/soft-typography";

// Soft UI Dashboard PRO React example components

// Soft UI Dashboard PRO React base styles
import typography from "assets/theme/base/typography";
import breakpoints from "assets/theme/base/breakpoints";

// Data

import reportsBarChartData from "./data/reportsBarChartData";
import gradientLineChartData from "./data/gradientLineChartData";
import salesTableData from "./data/salesTableData";

import MiniStatisticsCard from "components/cards/statistics-cards/mini-statistics-card";
import SalesTable from "components/tables/sales-table";
import ReportsBarChart from "components/charts/bar-charts/reports-bar-chart";
import GradientLineChart from "components/charts/line-charts/gradient-line-chart";
import Footer from "components/Footer";
import Globe from "components/Globe";
import BasicRangeShortcuts from "components/date-picker";
import DateRangePicker from "components/date-picker";
import { subDays } from "date-fns";
import SoftButton from "components/soft-button";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import moment from "moment";
import { useSelector } from "react-redux";
import PageLoader from "components/page-loader";

function Dashboard() {
  const { values } = breakpoints;
  const { size } = typography;
  const { chart, items } = reportsBarChartData;
  const [selectedRange, setSelectedRange] = useState([new Date(),new Date()]);
  const { orgId, userId } = useAuth()
  const [dashboardData, setDashboardData] = useState([])
  const [selectedToken, setSelectedToken] = useState({
    value: "",
    label: "All Tokens",
  })

  const [selectedSubCat, setSelectedSubCat] = useState({
    value: "",
    label: "Select Sub Category",
  })

  const [totalDataCount, setTotalDataCount] = useState(0);
  const entriesPerPage = 5
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalDataCount / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = Math.min(startIndex + entriesPerPage, totalDataCount);
  const projectId = useSelector((state) => state.projectIdList.projectId)
  const [subCatOption, setSubCatOptions] = useState([])
  const [isLoading,setLoading] = useState(false)
  const fetchData = async () => {
    setLoading(true)
    try {
      let url= `${process.env.REACT_APP_BASE_URL}data-sources/organization/${orgId}/projects/${projectId}/users/${userId}/metric?startDate=${moment(selectedRange[0]).format('YYYY/MM/DD').replace(/\//g, "-")}&endDate=${moment(selectedRange[1]).format('YYYY/MM/DD').replace(/\//g, "-")}&tokenUsageModel=${selectedToken?.value}&skip=${startIndex}`
      let url1=`${process.env.REACT_APP_BASE_URL}data-sources/organization/${orgId}/projects/${projectId}/users/${userId}/metric?startDate=${moment(selectedRange[0]).format('YYYY/MM/DD').replace(/\//g, "-")}&endDate=${moment(selectedRange[1]).format('YYYY/MM/DD').replace(/\//g, "-")}&tokenUsageModel=${selectedToken?.value}&skip=${startIndex}&tokenId=${selectedSubCat?.value || ""}`
      
      if(selectedSubCat?.value){
        url=url1
      }
      const salesData = await fetch(url)
      const data = await salesData.json()
      setDashboardData(data?.data)
      setTotalDataCount(data?.data?.totalSearches)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error(error, "error..")
    }
  }

  const fetchSelectedData = async (selectedValue) => {  
    try {
      if(selectedValue === 'orchestrate'){
        const data= await fetch(`${process.env.REACT_APP_BASE_URL}/orchestrate/organization/${orgId}/projects/${projectId}/flow?isAll=1`)
        const options= await data.json()
        const filtered= options && options?.data?.map((values)=>{return {label:values?.name,value:values?.id}})
        setSubCatOptions(filtered)
      }else if (selectedValue === 'aiChat'){
        const data= await fetch(`${process.env.REACT_APP_BASE_URL}/openAIchat/organizations/${orgId}/projects/${projectId}/users/${userId}/ai_chat`)
        const options= await data.json()
        const filtered= options && options?.data?.map((values)=>{return {label:values?.name,value:values?._id}})
        setSubCatOptions(filtered)       
      }
      else if(selectedValue === 'widget'){
        const data= await fetch(`${process.env.REACT_APP_BASE_URL}/widget/organizations/${orgId}/projects/${projectId}/users/${userId}`)
        const options= await data.json()
        const filtered= options && options?.data?.map((values)=>{return {label:values?.widgetName,value:values?._id}})
        setSubCatOptions(filtered)       
      }
      else if(selectedValue === 'shopify'){
        const data= await fetch(`${process.env.REACT_APP_BASE_URL}widget/shopify/users/${userId}/shopNames`)
        const options= await data.json()
        const filtered= options && options?.data?.map((values)=>{return {label:values?.shop,value:values?.shop}})
        setSubCatOptions(filtered)       
      }
      else if(selectedValue === 'wordpress'){
        const data= await fetch(`${process.env.REACT_APP_BASE_URL}widget/wordpress/users/${userId}/shopNames`)
        const options= await data.json()
        const filtered= options && options?.data?.map((values)=>{return {label:values?.shop,value:values?.shop}})
        setSubCatOptions(filtered)       
      }
      else{
        setSubCatOptions([])       
      }
      
    } catch (error) {
      console.error(error, "Error")
    }

  }

  const handleSelectedToken = (selected)=>{
    setLoading(true)
    setSelectedToken(selected)
    setSubCatOptions([])
    setSelectedSubCat({})
  }

  useEffect(()=>{
    if(orgId && userId && projectId && selectedToken.value.length){
      setLoading(true)
      fetchSelectedData(selectedToken?.value)
    }
  },[orgId, userId,projectId,selectedToken])
  useEffect(() => {
    if (orgId && userId && projectId) {
      setLoading(true)
      fetchData()
    }
  }, [orgId, userId,projectId,currentPage,selectedSubCat,selectedToken])

  return (
    <>
      <SoftBox py={3}>
        <Grid>
          <Grid item>
            <SoftBox mb={3} p={1}>
              <SoftTypography
                variant={window.innerWidth < values.sm ? "h3" : "h2"}
                textTransform="capitalize"
                fontWeight="bold"
              >
                Insights
              </SoftTypography>
            </SoftBox>
            <Grid item xs={12} md={10} lg={10}
              sx={{
                padding: 2,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "20px",
                backgroundColor: "white !important"
              }}
            >
              <DateRangePicker
                selectedRange={selectedRange}
                onChange={setSelectedRange}
                style={{ width: "100%" }}
              />
              <SoftButton
                sx={{ marginLeft: 2 }}
                variant="gradient" color="dark"
                onClick={fetchData}
                disabled={((selectedRange && !selectedRange.length) || selectedRange === null)}
              >
                Save
              </SoftButton>
            </Grid>
            {isLoading && <PageLoader />}
            {/* <Grid container>
              <Grid item xs={12}>
                <Globe
                  display={{ xs: "none", md: "block" }}
                  position="absolute"
                  top="10%"
                  right={0}
                  mt={{ xs: -12, lg: 1 }}
                  mr={{ xs: 0, lg: 10 }}
                  canvasStyle={{ marginTop: "3rem" }}
                />
              </Grid>
            </Grid> */}

            <Grid spacing={3}>
              <Grid item style={{ display: 'flex', gap: '20px' }}>
                <SoftBox mb={3} style={{ width: '100%' }}>
                  <MiniStatisticsCard
                    title={{ text: "Prompt", fontWeight: "bold" }}
                    count={dashboardData?.["Prompts"]}
                    // percentage={{  color: "success", text: "0%" }}
                    icon={{ color: "info", component: "paid" }}
                  />
                </SoftBox>
                <SoftBox mb={3} style={{ width: '100%' }}>
                  <MiniStatisticsCard
                    title={{ text: "Ai Voice Prompt", fontWeight: "bold" }}
                    count={dashboardData?.["Ai-Voice Prompt"]}
                    // percentage={{  color: "success", text: "+0%" }}
                    icon={{ color: "info", component: "public" }}
                  />
                </SoftBox>
              </Grid>
              <Grid item style={{ display: 'flex', gap: '20px' }}>
                <SoftBox mb={3} style={{ width: '100%' }}>
                  <MiniStatisticsCard
                    title={{ text: "Orchestrate", fontWeight: "bold" }}
                    count={dashboardData?.["Flows"]}
                    // percentage={{  color: "success", text: "0%" }}
                    icon={{ color: "info", component: "emoji_events" }}
                  />
                </SoftBox>
                <SoftBox mb={3} style={{ width: '100%' }}>
                  <MiniStatisticsCard
                    title={{ text: "Outbound Calls", fontWeight: "bold" }}
                    count={dashboardData?.["outBoundCall"]}
                    // percentage={{  color: "success", text: "+0%" }}
                    icon={{
                      color: "info",
                      component: "shopping_cart",
                    }}
                  />
                </SoftBox>
              </Grid>
            </Grid>
          </Grid>
          <Grid style={{ display: 'flex', gap: '20px' }} >
            <SoftBox mb={3} style={{ width: '100%' }}>
              <SalesTable title="Data By Indexes" tableData={dashboardData?.['Data by Projects']} setCurrentPage={setCurrentPage} currentPage={currentPage} totalPages={totalPages} startIndex={startIndex} endIndex={endIndex} totalDataCount={totalDataCount}/>
            </SoftBox>
            <SoftBox mb={3} style={{ width: '100%' }}>
              <ReportsBarChart
                title="active users"
                // description={
                //   <>
                //     (<strong>+23%</strong>) than last week
                //   </>
                // }
                chart={dashboardData?.chart || chart}
                items={items}
              />
            </SoftBox>
          </Grid>
          <Grid >
            <Grid item >
              <GradientLineChart
                title="Token Consumption"
                chart={dashboardData?.token || gradientLineChartData}
                selectedToken={selectedToken}
                handleSelectedToken={handleSelectedToken}
                subCatOption={subCatOption}
                selectedSubCat={selectedSubCat}
                setSelectedSubCat={setSelectedSubCat}

              />
            </Grid>
          </Grid>
        </Grid>
      </SoftBox>
      <Footer />
    </>
  );
}

export default Dashboard;
