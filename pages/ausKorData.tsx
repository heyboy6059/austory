import { getLatestAusKorDataset } from '../common/get'
import AusKorDataComponent from '../components/AusKorData'

export async function getStaticProps() {
  const ausKorDataset = await getLatestAusKorDataset()
  return {
    props: {
      ausKorDataset
    }
  }
}

const AusKorData = ({ ausKorDataset }) => {
  return <AusKorDataComponent ausKorDataset={ausKorDataset} />
}

export default AusKorData
