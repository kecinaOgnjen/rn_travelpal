import React from 'react'
import {Platform, SafeAreaView, View} from "react-native"
import Carousel, {Pagination} from 'react-native-snap-carousel'
import CarouselCardItem, {SLIDER_WIDTH, ITEM_WIDTH} from './CarouselCardItem'

const CarouselCards = ({data = [], colorScheme = null}) => {
    const [index, setIndex] = React.useState(0)
    const isCarousel = React.useRef(null)

    return (
        <SafeAreaView
            style={{
                backgroundColor:"#000",
                flex: 1
            }}
        >
            <View style={{flex: 1}}>
                <Carousel
                    layout="default"
                    ref={isCarousel}
                    sliderWidth={SLIDER_WIDTH}
                    itemWidth={ITEM_WIDTH}
                    data={data}
                    renderItem={CarouselCardItem}
                    // onSnapToItem={(index) => setIndex(index) }
                    onScrollIndexChanged={(index) => setIndex(index)}
                    // inactiveSlideOpacity={1}
                    // inactiveSlideScale={1}
                    enableSnap={true}
                    disableIntervalMomentum={true}
                    shouldOptimizeUpdates
                    // removeClippedSubviews={true}
                    useScrollView={Platform.select({ios: true, android: false})}
                    // useExperimentalSnap={Platform.select({ios: true, android: false})}
                    //
                    // containerCustomStyle={{
                    //     marginLeft: Platform.select({ios: 25, android: 0})
                    // }}
                    // scrollInterpolator={scrollInterpolator}
                    // slideInterpolatedStyle={animatedStyles}
                    vertical={false}
                    activeSlideAlignment={'left'}
                    inactiveSlideOpacity={1}
                />
                {
                    data && data.length <= 15 ?
                        <Pagination
                            containerStyle={{
                                marginVertical: '5%',
                                paddingVertical: 0
                            }}
                            dotsLength={data.length}
                            activeDotIndex={index}
                            carouselRef={isCarousel}
                            dotStyle={{
                                width: 10,
                                height: 10,
                                borderRadius: 5,
                                marginHorizontal: 0,
                                backgroundColor: '#fff'
                            }}
                            inactiveDotOpacity={0.4}
                            inactiveDotScale={0.6}
                            tappableDots={true}
                        />
                        :
                        <View
                            style={{
                                marginVertical: '5%',
                                paddingVertical: 0
                            }}/>
                }
            </View>
        </SafeAreaView>
    )
}


export default CarouselCards