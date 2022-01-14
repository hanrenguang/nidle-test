import { Table, message } from 'antd'
import { useState, useEffect, useContext } from 'react'
import { Link } from 'umi'
import { getProjectServer } from '@/services/project'
import AddProjectServer from '@/pages/Project/Settings/components/addProjectServer'
import { ChangelogContext } from '../context'

const ServerInput = props => {
  const changelog = useContext(ChangelogContext)
  const { project: projectId, environment: mode } = changelog
  const { value, onChange, readonly } = props
  const [serverList, setServerList] = useState([])
  let columns = [
    {
      title: '机器名',
      dataIndex: ['Server', 'name']
    },
    {
      title: 'IP',
      dataIndex: ['Server', 'ip']
    },
    {
      title: '目录',
      dataIndex: 'output'
    }
  ]

  useEffect(async () => {
    if (!readonly) {
      const {
        data: servers = [],
        success,
        errorMessage
      } = await getProjectServer({
        id: projectId,
        mode
      })

      if (success === true) {
        setServerList(servers)
      } else {
        setServerList([])
        message.error(errorMessage)
      }
    } else {
      setServerList(value || [])
    }
  }, [readonly])

  if (!readonly) {
    columns = columns.concat([
      {
        title: '使用状态',
        dataIndex: 'changelog',
        render: text => {
          return text ? (
            <Link to={`/project/${projectId}/changelog/detail?id=${text}`} target="_blank">
              被占用
            </Link>
          ) : (
            '空闲'
          )
        }
      },
      {
        title: '服务器状态',
        dataIndex: ['Server', 'status'],
        render: text => {
          return text === 1 ? '启用' : '禁用'
        }
      }
    ])
  } else {
    columns[0].dataIndex = 'ip'
    columns[1].dataIndex = 'ip'
  }

  const handlerAddServer = (type, server) => {
    setServerList(serverList.concat(server))
  }

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      onChange(
        selectedRows.map(item => {
          return {
            id: item.id,
            output: item.output,
            serverId: item.server
          }
        })
      )
    },
    getCheckboxProps: record => ({
      disabled: !record.Server.status || record.changelog
    })
  }

  return (
    <>
      <Table
        columns={columns}
        dataSource={serverList}
        rowKey="id"
        pagination={false}
        rowSelection={readonly ? null : rowSelection}
      />
      {readonly || (
        <AddProjectServer type="add" projectId={projectId} mode={mode} onChange={handlerAddServer}></AddProjectServer>
      )}
    </>
  )
}

export default {
  render: text => <ServerInput value={text} readonly />,
  renderFormItem: (text, props) => <ServerInput {...props} {...props?.fieldProps} />
}
