import { FC, useState, useEffect, useCallback } from 'react'
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridValueFormatterParams
  // GridValueGetterParams
} from '@mui/x-data-grid'
import { firestore, userToJSON } from '../../common/firebase'
import {
  COLOURS,
  FIRESTORE_USERS,
  KOR_DATE_WITHOUT_TIME_FORMAT
} from '../../common/constants'
import {
  FirebaseDocumentSnapshot,
  RawUser,
  User
} from '../../typing/interfaces'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import dayjs from 'dayjs'

const Admin: FC = () => {
  const [userData, setUserData] = useState<User[]>([])

  useEffect(() => {
    if (!userData?.length) {
      const fetchAllUserData = async () => {
        console.log('Fetch all user data')
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
      fetchAllUserData()
    }
  }, [userData])

  const cellStylingForBooleanValue = useCallback((params: GridCellParams) => {
    return (
      <span>
        {params.formattedValue ? (
          <CheckCircleIcon style={{ color: COLOURS.GREEN }} />
        ) : (
          <CancelIcon style={{ color: COLOURS.TEXT_GREY }} />
        )}
      </span>
    )
  }, [])

  const markNullToHyphen = useCallback(
    (params: GridValueFormatterParams) => params.value || '-',
    []
  )

  const columns: GridColDef[] = [
    { field: 'username', headerName: 'Username', width: 150 },
    {
      field: 'isAdmin',
      headerName: '관리자',
      width: 80,
      renderCell: cellStylingForBooleanValue
    },
    {
      field: 'disabled',
      headerName: '활성화',
      width: 80,
      // disabled -> enabled
      valueFormatter: (params: GridValueFormatterParams) => !params.value,
      renderCell: cellStylingForBooleanValue
    },
    {
      field: 'isMarketingEmail',
      headerName: '마케팅 이메일 수신',
      width: 90,
      renderCell: cellStylingForBooleanValue
    },
    {
      field: 'createdAt',
      headerName: '계정 생성 시간',
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams) =>
        dayjs(Number(params.value)).format(KOR_DATE_WITHOUT_TIME_FORMAT)
    },
    {
      field: 'myPostCountTotal',
      headerName: '작성 글 개수',
      valueFormatter: markNullToHyphen,
      width: 80
    },
    {
      field: 'providedCommentCountTotal',
      headerName: '작성 댓글 개수',
      valueFormatter: markNullToHyphen,
      width: 80
    },
    {
      field: 'providedViewCountTotal',
      headerName: '방문 조회수',
      valueFormatter: markNullToHyphen,
      width: 80
    }
  ]

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <DataGrid
        rows={userData.map(user => ({
          ...user,
          // REVIEW: temporarily added user.username as old users don't have uid
          id: user.uid || user.username
        }))}
        columns={columns}
        //   pageSize={}
      />
    </div>
  )
}

export default Admin
