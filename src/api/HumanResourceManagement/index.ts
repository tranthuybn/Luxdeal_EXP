import { useAxios } from '@/hooks/web/useAxios'
import { DEPARTMENT_DIRECTORY, API_URL,ROLE_API } from '@/utils/API_URL'
import { FORM_DATA, objectToQueryParams } from '@/utils/format'

const fixedBaseURL = API_URL
const request = useAxios()

interface Params {
  PageIndex?: number
  PageSize?: number
}

interface Params2 {
  pageindex?: number
  pagesize?: number
}
//branch
export const getBranchList = async (_params?: Params2): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${DEPARTMENT_DIRECTORY.BRANCH_LIST}`,
      params: {
        pageindex: 1,
        pagesize: 1000
      }
    },
    fixedBaseURL
  )
  return res && res.data
}
export const getBranchs = async (params: any): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${DEPARTMENT_DIRECTORY.BRANCH_LIST}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}


export const addNewBranch = async (data): Promise<IResponse> => {
  data = FORM_DATA(data)
  const res = await request.post({ url: `${DEPARTMENT_DIRECTORY.ADD_BRANCH}`, data }, fixedBaseURL)
  return res.data && res.data
}

export const updateBranch = async (data): Promise<IResponse> => {
  data = FORM_DATA(data)
  const res = await request.put(
    {
      url: `${DEPARTMENT_DIRECTORY.UPDATE_BRANCH}`, data
    },
    
    fixedBaseURL
  )
  return res && res.data
}
export const deleteBranch = async (params): Promise<IResponse> => {
  const res = await request.delete(
    {
      url: `${DEPARTMENT_DIRECTORY.DELETE_BRANCH}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}

//department
export const getDepartmentList = async (_params?: Params): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${DEPARTMENT_DIRECTORY.DEPARTMENT_LIST}`,
      params: {
        PageIndex: 1,
        pagesize: 1000
      }
    },
    fixedBaseURL
  )
  return res && res.data
}

export const getDepartments = async (params: any): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${DEPARTMENT_DIRECTORY.DEPARTMENT_LIST}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}

export const getDepartmentByID = async (params: any): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${DEPARTMENT_DIRECTORY.DEPARTMENT_BY_ID}`,
      params
    },
    fixedBaseURL
  )
  return res && res.data
}

export const getBranchByID = async (params: any): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${DEPARTMENT_DIRECTORY.BRANCH_BY_ID}`,
      params
    },
    fixedBaseURL
  )
  return res && res.data
}

export const getPositionByID = async (params: any): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${DEPARTMENT_DIRECTORY.POSITION_BY_ID}`,
      params
    },
    fixedBaseURL
  )
  return res && res.data
}

export const getTypeOfStaffByID = async (params: any): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${DEPARTMENT_DIRECTORY.TYPEOFSTAFF_BY_ID}`,
      params
    },
    fixedBaseURL
  )
  return res && res.data
}

export const addNewDepartment = async (data): Promise<IResponse> => {
  data = FORM_DATA(data)
  const res = await request.post(
    { url: `${DEPARTMENT_DIRECTORY.POST_NEW_DEPARTMENT}`,data },
    fixedBaseURL
  )
  return res.data && res.data
}

export const updateDepartment = async (data): Promise<IResponse> => {
  data = FORM_DATA(data)

  const res = await request.put(
    {
      url: `${DEPARTMENT_DIRECTORY.UPDATE_DEPARTMENT}`,data
    },
    fixedBaseURL
  )
  return res && res.data
}
export const deleteDepartment = async (params): Promise<IResponse> => {
  const res = await request.delete(
    {
      url: `${DEPARTMENT_DIRECTORY.DELETE_DEPARTMENT}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}

// position
export const getRankList = async (_params?: Params): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${DEPARTMENT_DIRECTORY.GET_LIST_POSITION}`,
      params: {
        PageIndex: 1,
        pagesize: 1000
      }
    },
    fixedBaseURL
  )
  return res && res.data
}
export const getRanks = async (params: any): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${DEPARTMENT_DIRECTORY.GET_LIST_POSITION}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}


export const addNewPosition = async (data): Promise<IResponse> => {
  data = FORM_DATA(data)
  const res = await request.post(
    { url: `${DEPARTMENT_DIRECTORY.ADD_POSITION}`, data },
    fixedBaseURL
  )
  return res.data && res.data
}

export const updatePosition = async (data): Promise<IResponse> => {
  data = FORM_DATA(data)
  const res = await request.put(
    {
      url: `${DEPARTMENT_DIRECTORY.UPDATE_POSITION}`,data
    },
    fixedBaseURL
  )
  return res && res.data
}
export const deletePosition = async (params): Promise<IResponse> => {
  const res = await request.delete(
    {
      url: `${DEPARTMENT_DIRECTORY.DELETE_POSITION}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}

//post new nhan su
export const addNewStaff = async (params: any): Promise<IResponse> => {
  const res = await request.post(
    {
      url: DEPARTMENT_DIRECTORY.ADD_NEW_STAFF,
      data: params
    },
    fixedBaseURL
  )
  return res.data && res.data.data
}

export const updeteStaffAccount = async (params): Promise<IResponse> => {
  const res = await request.put(
    {
      url: `${DEPARTMENT_DIRECTORY.UPDATE_STAFF_ACCOUNT}`,
      data:params
    },
    
    fixedBaseURL
  )
  return res && res.data
}

export const deleteStaffAccount = async (params): Promise<IResponse> => {
  const res = await request.delete(
    {
      url: `${DEPARTMENT_DIRECTORY.DELETE_STAFF_ACCOUNT}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}

export const getTypePersonnelList = async (_params?: Params): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${DEPARTMENT_DIRECTORY.GET_LIST_TYPEOFSTAFF}`,
      params: {
        PageIndex: 1,
        pagesize: 1000
      }
    },
    fixedBaseURL
  )
  return res && res.data
}

export const getTypePersonnels = async (params: any): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${DEPARTMENT_DIRECTORY.GET_LIST_TYPEOFSTAFF}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}

export const addNewTypeOfStaff = async (data): Promise<IResponse> => {
  data = FORM_DATA(data)
  const res = await request.post({ url: `${DEPARTMENT_DIRECTORY.ADD_STAFF}`, data }, fixedBaseURL)
  return res.data && res.data
}

export const updateTypeOfStaff = async (data): Promise<IResponse> => {
  data = FORM_DATA(data)
  const res = await request.put(
    {
      url: `${DEPARTMENT_DIRECTORY.UPDATE_STAFF}`,
      data
    },
    fixedBaseURL
  )
  return res && res.data
}
export const deleteTypeOfStaff = async (params): Promise<IResponse> => {
  const res = await request.delete(
    {
      url: `${DEPARTMENT_DIRECTORY.DELETE_STAFF}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}
export const getStaffInfoByAccountId = async (params): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${DEPARTMENT_DIRECTORY.GET_STAFF_INFO_BY_ACCOUNT}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}
export const getRoleList = async (params): Promise<IResponse> => {
  const res = await request.get(
    {
      url: `${DEPARTMENT_DIRECTORY.GET_ROLE_LIST}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}
export const postCreateNewStaffRole = async (params): Promise<IResponse> => {
  const res = await request.post(
    {
      url: ROLE_API.CREATE_NEW_STAFF_ROLE,
      data:params
    },
    fixedBaseURL
  )
  return res && res.data
}
 
export const getRoleDetail = async (params): Promise<IResponse> => { 
  const res = await request.get(
    {
      url: `${ROLE_API.GET_ROLE_DETAIL}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}

export const editStaffRole = async (id, params): Promise<IResponse> => {
  const res = await request.put(
    {
      url: `${ROLE_API.UPDATE_STAFF_ROLE}?id=${id}`,
      data:params
    },
    
    fixedBaseURL
  )
  return res && res.data
}

export const deleteStaffRole = async (params): Promise<IResponse> => {
  const res = await request.delete(
    {
      url: `${ROLE_API.DELETE_STAFF_ROLE}?${objectToQueryParams(params)}`
    },
    fixedBaseURL
  )
  return res && res.data
}
