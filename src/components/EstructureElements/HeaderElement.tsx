import { View, Text, TouchableOpacity, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Input } from '../FormElements'
import { Ionicons } from '@expo/vector-icons'
import { useDataContext } from '../../context/AuthContextUser'
import { countryApi } from '../../services/countryApi'
import { Country } from '../../@types/interfaces/CountryInterface'
import ModalPicker from './ModalPicker'

const HeaderElement = () => {

  const [search, setSearch] = useState('')
  const { country, setCountry, setLoading, setIsFilterActivate, Order, orderBy, setOrderBy } = useDataContext()
  const [visbleModal, setVisibleModal] = useState(false)
  const [currentFilterRegion, setCurrentFilterRegion] = useState('')
  const [typeModal, setTypeModal] = useState<'OrderBy' | 'Region'>('Region')

  async function getAllCountries() {
    setLoading(true)
    setIsFilterActivate(true)
    try {
      const response = await countryApi.get('/all')
      const FilterCountries = response.data.filter(
        (countrie: Country) =>
          countrie.name.common.toLowerCase().includes(search.toLowerCase())
      );

      const DisignedOrderBy = Order(response.data)

      if (search == '') {
        setCountry(DisignedOrderBy.slice(0, 12))
        setIsFilterActivate(false)
      } else {
        setCountry(FilterCountries)
      }


      setLoading(false)
    } catch (error) {

    }
  }

  async function GetCountriesByRegion() {
    setLoading(true)
    setIsFilterActivate(true)
    try {
      const response = await countryApi.get(`/region/${currentFilterRegion}`)

      const DisignedOrderBy = Order(response.data)

      setCountry(DisignedOrderBy)

      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  function VisibleModalAndSetType(type: 'OrderBy' | 'Region') {
    setTypeModal(type)
    setVisibleModal(true)
  }

  useEffect(() => {
    getAllCountries()
  }, [search]);

  useEffect(() => {
    if (currentFilterRegion !== '') {
      GetCountriesByRegion()
    } else {
      getAllCountries()
    }
  }, [currentFilterRegion,orderBy])

  

  return (
    <View className='flex-row justify-between p-[3%] bg-zinc-900 items-center'>
      <View>
        <Text className='text-white text-2xl font-bold mb-4'>
          Galery Countries
        </Text>

        <View className='flex-row gap-[5%]'>
          <TouchableOpacity className='bg-white p-1 items-center justify-center rounded-lg'
            onPress={() => VisibleModalAndSetType("Region")}>
            <Text className='font-bold'>
              {currentFilterRegion || 'Todos'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className='bg-white p-1 items-center justify-center rounded-lg'
            onPress={() => VisibleModalAndSetType("OrderBy")}>
            <Text className='font-bold'>
              {orderBy || 'Nenhum'}
            </Text>
          </TouchableOpacity>

        </View>
        <Input stylish='bg-white w-[100%] mt-2 p-1 text-black font-bold'
          placeholder='Buscar...'
          placeholderTextColor={"#736c6c"}
          onChangeText={setSearch} />
      </View>

      <TouchableOpacity className='bg-white p-[4%] rounded-xl items-center'>
        <Ionicons name='md-sunny' size={34} />
        <Text className='font-bold'>white mode</Text>
      </TouchableOpacity>


      <Modal transparent={true}
        visible={visbleModal}
        animationType={"slide"}>
        <ModalPicker setCurrentFilterRegion={setCurrentFilterRegion}
          setModalVisible={setVisibleModal}
          setOrderBy={setOrderBy}
          type={typeModal} />
      </Modal>
    </View>
  )
}

export default HeaderElement