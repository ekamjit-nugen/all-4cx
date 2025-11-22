import { api } from 'services/api'
import client from './client'

const getAvailablePrompts = (body) => client.post(`/prompts-list`, body)
const getPrompt = (body) => client.post(`/load-prompt`, body)
const getSelectedValueData = (organizationId,projectId) => api.get(`/prompt/organizations/${organizationId}/project/${projectId}/flow-prompt`)
const getVersionData = (promptId,version) => api.get(`/prompt/${promptId}/version/${version}`)
const getCategoryData = (organizationId,projectId,userId) => api.get(`prompt/organizations/${organizationId}/project/${projectId}/authors/${userId}/promptCategory`)
const getCategoryDataAi = (organizationId,projectId,userId) => api.get(`prompt/organizations/${organizationId}/project/${projectId}/authors/${userId}/promptCategory?aiVoicePrompt=${true}`)
const getCategoryDataOrg = (organizationId,projectId,userId,orgValue) => api.get(`prompt/organizations/${organizationId}/project/${projectId}/authors/${userId}/promptCategory?organization=${orgValue}`)
const getCategoryDataOrgAi = (organizationId,projectId,userId,orgValue) => api.get(`prompt/organizations/${organizationId}/project/${projectId}/authors/${userId}/promptCategory?organization=${orgValue}&aiVoicePrompt=${true}`)
const getPromptListData = (orgId,projectId,promptId) => api.get(`/prompt?organizationId=${orgId}&projectId=${projectId}&categoryName=${promptId}`)
const getPromptListDataOrg = (orgId,projectId,promptId) => api.get(`/prompt?organizationId=${orgId}&projectId=${projectId}&categoryName=${promptId}&isOrganization=${true}`)
const getPromptListDataAi = (orgId,projectId,promptId) => api.get(`/prompt?organizationId=${orgId}&projectId=${projectId}&promptAiVoice=${true}&categoryName=${promptId}`)
const getPromptListDataOrgAi = (orgId,projectId,promptId) => api.get(`/prompt?organizationId=${orgId}&projectId=${projectId}&promptAiVoice=${true}&categoryName=${promptId}&isOrganization=${true}`)

export default {
    getAvailablePrompts,
    getSelectedValueData,
    getVersionData,
    getPrompt,
    getCategoryData,
    getCategoryDataAi,
    getCategoryDataOrg,
    getCategoryDataOrgAi,
    getPromptListData,
    getPromptListDataOrg,
    getPromptListDataAi,
    getPromptListDataOrgAi
}
