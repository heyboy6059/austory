import {
  AusKorData,
  DataGroupName,
  UnitType,
  DataSourceType
} from '../typing/data'

export const customAusKorData = (): AusKorData[] => {
  return [
    // 수도
    // 국가 전화 코드
    // 국화
    // 가장 높은 산?
    //
    {
      // Land size
      definition: {
        dataGroupName: DataGroupName.NATIONAL_INFO,
        dataLabelEng: 'Land Size',
        dataLabelKor: '면적',
        dataDesc:
          '호주의 면적은 한국보다 약 77배 크며 세계에서 6번째로 가장 큽니다.',
        sort: 100,
        unitType: UnitType.KM2,
        isHighlight: true,
        dataSourceType: DataSourceType.THE_WORLD_FACT,
        sourceLink:
          'https://www.cia.gov/the-world-factbook/countries/australia/'
      },
      sourceName: '',
      sourceLastUpdated: null,
      data: {
        ausOnly: {
          year: null,
          value: '7692024'
        },
        ausKorCompare: {
          aus: {
            year: null,
            value: '7692024'
          },
          kor: {
            year: null,
            value: '100339'
          }
        }
      }
    },
    {
      // Capital City
      definition: {
        dataGroupName: DataGroupName.NATIONAL_INFO,
        dataLabelEng: 'Capital City',
        dataLabelKor: '수도',
        dataDesc: '참고로 시드니는 호주에서 가장 큰 도시입니다.',
        sort: 200,
        unitType: UnitType.STRING,
        isHighlight: true,
        dataSourceType: DataSourceType.THE_WORLD_FACT,
        sourceLink:
          'https://www.cia.gov/the-world-factbook/countries/australia/'
      },
      sourceName: '',
      sourceLastUpdated: null,
      data: {
        ausOnly: {
          year: null,
          value: '캔버라(Canberra)'
        },
        ausKorCompare: {
          aus: {
            year: null,
            value: '캔버라(Canberra)'
          },
          kor: {
            year: null,
            value: '서울(Seoul)'
          }
        }
      }
    },
    {
      definition: {
        dataGroupName: DataGroupName.NATIONAL_INFO,
        dataLabelEng: 'National floral emblem',
        dataLabelKor: '국화',
        dataDesc: '골든 와틀은 아카시아 종 입니다.',
        sort: 300,
        unitType: UnitType.STRING,
        isHighlight: true,
        dataSourceType: DataSourceType.GOVERNMENT
      },
      sourceName: '',
      sourceLastUpdated: null,
      data: {
        ausOnly: {
          year: null,
          value: '골든 와틀(the Golden Wattle)'
        },
        ausKorCompare: {
          aus: {
            year: null,
            value: '골든 와틀(the Golden Wattle)'
          },
          kor: {
            year: null,
            value: '무궁화(Mugunghwa)'
          }
        }
      }
    },
    {
      definition: {
        dataGroupName: DataGroupName.NATIONAL_INFO,
        dataLabelEng: 'Country Code',
        dataLabelKor: '국가 코드',
        dataDesc: '',
        sort: 400,
        unitType: UnitType.NUMBER,
        isHighlight: true,
        dataSourceType: DataSourceType.WORLDOMETERS,
        sourceLink: 'https://www.worldometers.info/country-codes/'
      },
      sourceName: '',
      sourceLastUpdated: null,
      data: {
        ausOnly: {
          year: null,
          value: '61'
        },
        ausKorCompare: {
          aus: {
            year: null,
            value: '61'
          },
          kor: {
            year: null,
            value: '82'
          }
        }
      }
    }
  ]
}
