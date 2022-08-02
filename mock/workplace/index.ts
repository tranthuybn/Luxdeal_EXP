import { config } from '@/config/axios/config'
import { MockMethod } from 'vite-plugin-mock'

const { result_code } = config

const timeout = 1000

export default [
  // Get statistics
  {
    url: '/workplace/total',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: result_code,
        data: {
          project: 40,
          access: 2340,
          todo: 10
        }
      }
    }
  },
  // Project
  {
    url: '/workplace/project',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: result_code,
        data: [
          {
            name: 'Dự án 1',
            icon: 'logos:bun',
            message: 'workplace.introduction',
            personal: 'Nguyễn Thuỳ Chi',
            time: new Date()
          },
          {
            name: 'Dự án 2',
            icon: 'logos:docusaurus',
            message: 'workplace.introduction',
            personal: 'Nguyễn Thuỳ Chi',
            time: new Date()
          },
          {
            name: 'Dự án 3',
            icon: 'logos:ember-tomster',
            message: 'workplace.introduction',
            personal: 'Nguyễn Thuỳ Chi',
            time: new Date()
          },
          {
            name: 'Dự án 4',
            icon: 'logos:foundation',
            message: 'workplace.introduction',
            personal: 'Nguyễn Thuỳ Chi',
            time: new Date()
          },
          {
            name: 'Dự án 5',
            icon: 'logos:gopher',
            message: 'workplace.introduction',
            personal: 'Nguyễn Thuỳ Chi',
            time: new Date()
          },
          {
            name: 'Dự án 6',
            icon: 'logos:tastejs',
            message: 'workplace.introduction',
            personal: 'Nguyễn Thuỳ Chi',
            time: new Date()
          }
        ]
      }
    }
  },
  // Get dynamic
  {
    url: '/workplace/dynamic',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: result_code,
        data: [
          {
            keys: ['workplace.push', 'Github'],
            time: new Date()
          },
          {
            keys: ['workplace.push', 'Github'],
            time: new Date()
          },
          {
            keys: ['workplace.push', 'Github'],
            time: new Date()
          },
          {
            keys: ['workplace.push', 'Github'],
            time: new Date()
          },
          {
            keys: ['workplace.push', 'Github'],
            time: new Date()
          },
          {
            keys: ['workplace.push', 'Github'],
            time: new Date()
          }
        ]
      }
    }
  },
  // Get team information
  {
    url: '/workplace/team',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: result_code,
        data: [
          {
            name: 'Github',
            icon: 'akar-icons:github-fill'
          },
          {
            name: 'Vue',
            icon: 'logos:vue'
          },
          {
            name: 'Angular',
            icon: 'logos:angular-icon'
          },
          {
            name: 'React',
            icon: 'logos:react'
          },
          {
            name: 'Webpack',
            icon: 'logos:webpack'
          },
          {
            name: 'Vite',
            icon: 'vscode-icons:file-type-vite'
          }
        ]
      }
    }
  },
  // Acquisition index
  {
    url: '/workplace/radar',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: result_code,
        data: [
          { name: 'workplace.sale', max: 65, personal: 42, team: 50 },
          { name: 'workplace.lease', max: 160, personal: 30, team: 140 },
          { name: 'workplace.spa', max: 300, personal: 20, team: 28 },
          { name: 'workplace.deposit', max: 130, personal: 35, team: 35 },
          { name: 'workplace.mortgage', max: 100, personal: 80, team: 90 }
        ]
      }
    }
  }
] as MockMethod[]
