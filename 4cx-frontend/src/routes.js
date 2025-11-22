// Icons
import { Mediation, Shop } from "@mui/icons-material";
import BuildIcon from "@mui/icons-material/Build";

import SearchIcon from "@mui/icons-material/Search";
import WidgetsIcon from "@mui/icons-material/Widgets";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import DataUsageIcon from "@mui/icons-material/DataUsage";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

// Components

import Dashboard from "./pages/dashboard";
import SignUpComponent from "./pages/signup";
import SignInComponent from "./pages/signIn";
import CreateProjectPage from "./pages/create-project";
import PromptCreate from "./pages/prompts/create/create";
import AddDataSourceComponent from "./pages/data/add/add";
import PromptList from "./pages/prompts/prompt-project-list/prompt-list";
import PromptTemplate from "./pages/prompts/template/templates";
import CreateOrganizationPage from "./pages/create-organization";
import DataSourceComponent from "./pages/data/add-source/data-sources";
import Document from "components/Icons/Document";
import AzureChat from "pages/agents/AzureChat";
import IndexingRetrieval from "pages/search/indexing-retrieval";
import SearchNewDesign from "pages/search/search-new-design";
import Retrieval from "pages/search/retrieval-flow";
import SearchIndexList from "pages/search/search-index-list";
import Canvas from "pages/flowies/views/canvas";
import Marketplace from "pages/flowies/views/marketplaces";
import MarketplaceCanvas from "pages/flowies/views/marketplaces/MarketplaceCanvas";
import { RocketIcon } from "lucide-react";
import Chatflows from "pages/flowies/views/chatflows";
import SearchWidgetSettings from "pages/widgets/widget-settings";
import WidgetLists from "pages/widgets/widget-lists";
import UnauthorizedAccess from "pages/error/unauthorizedAccess";
import AiNewPage from "pages/aiVoice";
import CreateAI from "pages/aiVoice/CreateAI";
import PhoneNumbersList from "pages/aiVoice/phone-numbers-list";
import PhoneNumber from "pages/aiVoice/phone-number";
import Outbound from "pages/aiVoice/outbound";
import OutboundList from "pages/aiVoice/outbound/OutboundList";

const routes = [
  {
    type: "route",
    name: "Create Organization",
    key: "create-organization",
    route: "/create-organization",
    component: <CreateOrganizationPage />,
  },
  {
    route: "/agentcanvas",
    component: <Canvas />,
  },
  {
    type: "route",
    name: "Create Project",
    key: "create-project",
    route: "/create-project",
    component: <CreateProjectPage />,
  },
  {
    type: "route",
    name: "Unauthorized Access",
    key: "Unauthorized Access",
    route: "/unauthorizedAccess",
    component: <UnauthorizedAccess />,
  },
  {
    type: "route",
    name: "Phone Number",
    key: "Phone Number",
    route: "/ai-voice/phone-number",
    component: <PhoneNumber />,
  },
  {
    name: "Indexing",
    key: "indexing",
    route: "/search/indexing",
    component: <SearchNewDesign />,
  },
  {
    name: "Retrieval",
    key: "retrieval",
    route: "/search/retrieval",
    component: <Retrieval />,
  },
  {
    type: "route",
    name: "Create Project",
    key: "create-project",
    route: "/canvas/:id",
    component: <Canvas />,
  },
  {
    type: "route",
    name: "Market Place",
    key: "market-place",
    route: "/marketplace/:id",
    component: <MarketplaceCanvas />,
  },
  {
    type: "collapse",
    name: "Authentication",
    key: "authentication",
    icon: <Document size="12px" />,
    collapse: [
      {
        name: "Sign In",
        key: "sign-in",
        collapse: [
          {
            name: "Basic",
            key: "sign-in",
            route: "/authentication/sign-in/*",
            component: <SignInComponent />,
          },
        ],
      },
      {
        name: "Sign Up",
        key: "sign-up",
        collapse: [
          {
            name: "Basic",
            key: "basic",
            route: "/authentication/sign-up/*",
            component: <SignUpComponent />,
          },
        ],
      },
    ],
  },
  {
    type: "collapse",
    name: "Dashboards",
    key: "dashboards",
    icon: <Shop size="12px" />,
    collapse: [
      {
        name: "Default",
        key: "/",
        route: "/",
        component: <Dashboard />,
      },
    ],
  },
  { type: "title", title: "Capability", key: "title-docs" },
  {
    type: "collapse",
    name: "AI Index",
    key: "AI Index",
    icon: <SearchIcon size="12px" />,
    collapse: [
      {
        name: "Indexes",
        key: "indexes",
        route: "/aiIndex/indexes",
        component: <SearchIndexList />,
      },
      {
        name: "Create Index",
        key: "general",
        route: "/aiIndex/general",
        component: (
          <>
            <IndexingRetrieval />
          </>
        ),
      },
    ],
  },
  {
    type: "collapse",
    name: "AI Voice",
    key: "ai-voice",
    icon: <BuildIcon size="12px" />,
    collapse: [
      {
        name: "Create AI Voice",
        key: "createAI",
        route: "/ai-voice/createAI",
        component: <CreateAI />,
      },
      {
        name: "AI Voice List",
        key: "aiList",
        route: "/ai-voice/aiList",
        component: <AiNewPage />,
      },
      {
        name: "Inbound",
        key: "inbound",
        route: "/ai-voice/inbound",
        component: <><PhoneNumber /></>,
      },
      {
        name: "Outbound",
        key: "outbound",
        route: "/ai-voice/outbound",
        component: <><Outbound/></>,
      },
      {
        name: "Phone Numbers",
        key: "phone-numbers",
        route: "/ai-voice/phone-numbers",
        component: <PhoneNumbersList />,
      },
      {
        name: "Outbound List",
        key: "outbound-list",
        route: "/ai-voice/outbound-list",
        component: <OutboundList />,
      },
    ],
  },
  {
    type: "collapse",
    name: "AI Assistant",
    key: "AI Assistant",
    icon: <ShoppingCartIcon size="12px" />,
    collapse: [
      {
        name: "Chat",
        key: "chat",
        route: "/agent-assist/chat",
        component: <AzureChat />,
      },
    ],
  },
  {
    type: "collapse",
    name: "AI Insights",
    key: "AI Insights",
    icon: <FileCopyIcon size="12px" />,
    collapse: [
      {
        name: "Configure",
        key: "configure",
        route: "/chatbots/configure",
        component: <></>,
      },
      {
        name: "Design",
        key: "design",
        route: "/chatbots/design",
        component: <></>,
      },
      {
        name: "Integration",
        key: "integration",
        route: "/chatbots/integration",
        component: <></>,
      },
      {
        name: "Logging",
        key: "logging",
        route: "/chatbots/logging",
        component: <></>,
      },
    ],
  },
  { type: "divider", key: "divider-1" },
  { type: "title", title: "Assets", key: "title-assets" },
  {
    type: "collapse",
    name: "Prompts",
    key: "prompt",
    icon: <RocketIcon size="12px" />,
    collapse: [
      {
        name: "Create Prompt",
        key: "createPrompt",
        route: "/prompt/createPrompt",
        component: <PromptCreate />,
      },
      {
        name: "Prompt List",
        key: "project",
        route: "/prompt/project",
        component: <PromptList />,
      },
      {
        name: "Templates",
        key: "template",
        route: "/prompt/template",
        component: <PromptTemplate />,
      },
    ],
  },
  {
    type: "collapse",
    name: "Orchestrate",
    key: "orchestrate",
    icon: <Mediation size="12px" />,
    collapse: [
      {
        name: "Create Flow",
        key: "canvas",
        route: "/orchestrate/canvas",
        component: <Canvas />,
      },
      {
        name: "Flows",
        key: "flows",
        route: "/orchestrate/flows",
        component: <Chatflows />,
      },
      {
        name: "Market Place",
        key: "marketplace",
        route: "/orchestrate/marketplace",
        component: <Marketplace />,
      },
    ],
  },
  {
    type: "collapse",
    name: "Data",
    key: "data",
    icon: <DataUsageIcon size="12px" />,
    collapse: [
      {
        name: "Add",
        key: "add",
        route: "/data/add",
        component: <AddDataSourceComponent />,
      },
      {
        name: "Data Sources",
        key: "data-sources",
        route: "/data/data-sources",
        component: <DataSourceComponent />,
      },
    ],
  },
  {
    type: "collapse",
    name: "Widget",
    key: "widget",
    icon: <WidgetsIcon size="12px" />,
    collapse: [
      {
        name: "Widget List",
        key: "widget-lists",
        route: "/widget/widget-lists",
        component: (
          <>
            <WidgetLists />
          </>
        ),
      },
      {
        name: "Create Widget",
        key: "settings",
        route: "/widget/settings",
        component: (
          <>
            <SearchWidgetSettings />
          </>
        ),
      },
    ],
  },
];

export default routes;
