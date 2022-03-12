import { FC, useState, useEffect } from 'react'
import {
  DataGrid,
  GridColDef
  // GridValueGetterParams
} from '@mui/x-data-grid'
import { firestore, userToJSON } from '../../common/firebase'
import { FIRESTORE_USERS } from '../../common/constants'
import {
  FirebaseDocumentSnapshot,
  RawUser,
  User
} from '../../typing/interfaces'

const Admin: FC = () => {
  const [userData, setUserData] = useState<User[]>([])

  useEffect(() => {
    if (!userData?.length) {
      const fetchUserData = async () => {
        const usersQuery = firestore
          .collection(FIRESTORE_USERS)
          .orderBy('createdAt', 'desc')
        const userData = (await usersQuery.get()).docs
        setUserData(
          userData.map(userDoc =>
            userToJSON(userDoc as FirebaseDocumentSnapshot<RawUser>)
          )
        )
      }
      fetchUserData()
    }
  }, [userData])

  const columns: GridColDef[] = [
    { field: 'username', headerName: 'Username', width: 90 },
    { field: 'isAdmin', headerName: '관리자', width: 90 },
    { field: 'disabled', headerName: '활성화', width: 90 },
    { field: 'isMarketingEmail', headerName: '마케팅 이메일 수신', width: 90 },
    { field: 'isMarketingEmail', headerName: '마케팅 이메일 수신', width: 90 },
    { field: 'createdAt', headerName: '계정 생성 시간', width: 90 }
  ]
  return (
    <div style={{ width: '100%', height: '600px' }}>
      <DataGrid
        rows={userData.map(user => ({ ...user, id: user.uid }))}
        columns={columns}
        //   pageSize={}
      />
    </div>
  )
}

export default Admin
