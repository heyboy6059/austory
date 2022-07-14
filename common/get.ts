import {
  Category,
  FeatureDetail,
  Post,
  RawPost,
  TopCategory
} from '../typing/interfaces'
import {
  FIRESTORE_CATEGORIES,
  FIRESTORE_CATEGORIES_TOP,
  FIRESTORE_FEATURE_DETAILS,
  FIRESTORE_PROPERTY_REPORTS,
  FIRESTORE_PROPERTY_REPORT_LABELS,
  FIRESTORE_USERNAMES,
  POST_FEED_NUM_LIMIT
} from './constants'
import {
  categoryToJSON,
  featureDetailToJSON,
  firestore,
  fromMillis,
  postQueryDocToJSON,
  propertyReportLabelToJSON,
  propertyReportToJSON,
  topCategoryToJSON
} from './firebase'
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  QueryDocumentSnapshot,
  startAfter
} from 'firebase/firestore'
import { Feature, PropertyReportType, TopCategoryTab } from '../typing/enums'

export const getUidByUsername = async (
  username: string
): Promise<{ uid: string }> => {
  const ref = firestore.collection(FIRESTORE_USERNAMES).doc(username)
  const userRes = (await ref.get()).data()
  if (!userRes || !userRes?.uid) {
    throw new Error(
      `No username object found by provided username: ${username}`
    )
  }
  return { uid: userRes.uid }
}

export const getAllCategories = async (): Promise<Category[]> => {
  const querySnapshot = await firestore
    .collection(FIRESTORE_CATEGORIES)
    .where('disabled', '==', false)
    .orderBy('sort')
    .get()
  return querySnapshot.docs.map(categoryToJSON)
}

export const getAllTopCategories = async (): Promise<TopCategory[]> => {
  const querySnapshot = await firestore
    .collection(FIRESTORE_CATEGORIES_TOP)
    .where('disabled', '==', false)
    .orderBy('sort')
    .get()
  return querySnapshot.docs.map(topCategoryToJSON)
}

export const getPostsByTopCategory = async (
  topCategoryTab: TopCategoryTab,
  lastPost?: Post
): Promise<Post[]> => {
  const queryConstraints = []
  queryConstraints.push(where('deleted', '==', false))

  // 인크라우
  // if (topCategoryTab === TopCategoryTab.OFFICIAL) {
  //   queryConstraints.push(where('isInkrauOfficial', '==', true))
  // }

  if (topCategoryTab === TopCategoryTab.QUESTION) {
    queryConstraints.push(
      where('categories', 'array-contains', {
        categoryId: 'category-question',
        name: '질문'
      })
    )
  }

  if (topCategoryTab === TopCategoryTab.DEAL) {
    queryConstraints.push(
      where('categories', 'array-contains', {
        categoryId: 'category-deal',
        name: 'DEAL'
      })
    )
  }

  if (topCategoryTab === TopCategoryTab.AUS_NEWS) {
    queryConstraints.push(
      where('categories', 'array-contains', {
        categoryId: 'category-aus-news',
        name: '호주 뉴스'
      })
    )
  }

  if (topCategoryTab === TopCategoryTab.INFO) {
    queryConstraints.push(
      where('categories', 'array-contains', {
        categoryId: 'category-info',
        name: '정보'
      })
    )
  }

  queryConstraints.push(orderBy('createdAt', 'desc'))
  if (lastPost) {
    const cursor =
      typeof lastPost.createdAt === 'number'
        ? fromMillis(lastPost.createdAt)
        : lastPost.createdAt

    queryConstraints.push(startAfter(cursor))
  }

  // limit the total number
  queryConstraints.push(limit(POST_FEED_NUM_LIMIT))

  const q = query(collection(firestore, 'posts'), ...queryConstraints)
  const querySnapshot = await getDocs(q)
  const docs = querySnapshot.docs as QueryDocumentSnapshot<RawPost>[]
  const filteredDocs = docs.map(postQueryDocToJSON)
  return filteredDocs
}

export const getFeatureDetail = async (
  feature: Feature
): Promise<FeatureDetail> => {
  const querySnapshot = await firestore
    .collection(FIRESTORE_FEATURE_DETAILS)
    .where('featureId', '==', feature)
    .limit(1)
    .get()

  console.log({ snapshotDocs: querySnapshot.docs.map(e => e.data()) })
  return querySnapshot.docs.map(featureDetailToJSON)[0]
}

export const getAllPropertyReportLabels = async (
  propertyReportType: PropertyReportType
) => {
  const querySnapshot = await firestore
    .collection(FIRESTORE_PROPERTY_REPORT_LABELS)
    .orderBy('createdAt')
    .where('propertyReportType', '==', propertyReportType)
    .get()

  return querySnapshot.docs.map(propertyReportLabelToJSON)
}

export const getAllPropertyReports = async (
  propertyReportType: PropertyReportType
) => {
  const querySnapshot = await firestore
    .collection(FIRESTORE_PROPERTY_REPORTS)
    .where('propertyReportType', '==', propertyReportType)
    .orderBy('createdAt')
    .get()

  return querySnapshot.docs.map(propertyReportToJSON)
}
