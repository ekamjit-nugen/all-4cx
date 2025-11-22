import { api } from 'services/api'
import client from './client'

const getAllChatflows = (projectId,skip) => api.get(`/orchestrate/organization/${projectId?.orgId}/projects/${projectId?.projectId}/flow?skip=${skip}&limit=${9}`)
const getAllChatflowsWidget = (projectId) => api.get(`/orchestrate/organization/${projectId?.orgId}/projects/${projectId?.projectId}/flow?isAll=${1}`)
const getAllChatflowsAi = (orgId,projectId,skip) => api.get(`/orchestrate/organization/${orgId}/projects/${projectId}/flow?skip=${skip}&limit=${5}`)

const getOrgChatflows = (projectId) => api.get(`/orchestrate/organization/${projectId?.orgId}/projects/${projectId?.projectId}/flow?isOrganization=true`)

const getOrgChatflowsPermisson = (projectId,flow_id) => api.get(`/orchestrate/organization/${projectId?.orgId}/projects/${projectId?.projectId}/flowies/${flow_id}/authorIdentity`)

const getAllAgentflows = () => client.get('/chatflows?type=MULTIAGENT')

const getSpecificChatflow = (id) => client.get(`/chatflows/${id}`)

const getSpecificChatflowFromPublicEndpoint = (id) => client.get(`/public-chatflows/${id}`)

const createNewChatflow = (body) => client.post(`/chatflows`, body)

const importChatflows = (body) => client.post(`/chatflows/importchatflows`, body)

const updateChatflow = (id, body) => client.put(`/chatflows/${id}`, body)

const deleteChatflow = (id) => client.delete(`/chatflows/${id}`)

const getIsChatflowStreaming = (id) => client.get(`/chatflows-streaming/${id}`)

const getAllowChatflowUploads = (id) => client.get(`/chatflows-uploads/${id}`)

export default {
    getAllChatflows,
    getAllChatflowsAi,
    getAllChatflowsWidget,
    getOrgChatflows,
    getAllAgentflows,
    getOrgChatflowsPermisson,
    getSpecificChatflow,
    getSpecificChatflowFromPublicEndpoint,
    createNewChatflow,
    importChatflows,
    updateChatflow,
    deleteChatflow,
    getIsChatflowStreaming,
    getAllowChatflowUploads
}
