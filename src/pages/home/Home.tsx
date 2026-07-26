import { useMemo, useCallback, useState, CSSProperties, useEffect } from 'react';

import { 
    spacingN, CheckBoxStd, PageContainerStd, NavButtonProps, useTheme, StylesCheckBoxStd, ComboBoxStd, StylesComboBoxStd, TextStd,
    ButtonStd, ButtonStdPressEvent, PopUpProps, StylesButtonStd,
    useWindowSize, utils,
    IconFunc, 
} from "@/standard_ui/standard_ui";

import ArrowUp from '@mui/icons-material/ArrowUpward';
import ArrowDown from '@mui/icons-material/ArrowDownward';

import { stylePageConNoPadding } from '@/utils/styles';

import { isLocation, Location } from '@/types/Location';

import { sounds } from '@/utils/sounds';

import "./home.css";

const gIconUpward : IconFunc = (pSize : number, pColour : string) =>
{
    return <ArrowUp sx = {{ color: pColour, fontSize: pSize }} />
};

const gIconDownward : IconFunc = (pSize : number, pColour : string) =>
{
    return <ArrowDown sx = {{ color: pColour, fontSize: pSize }} />
};

const FONT_SIZE_MAX : number = 40;
const FONT_SIZE_MIN : number = 10;

function getPressLocation(pEvent: ButtonStdPressEvent) : Location
{
    const lBounds = pEvent.currentTarget.getBoundingClientRect();

    const lPoint = 'touches' in pEvent
        ? pEvent.touches[0] ?? pEvent.changedTouches[0]
        : pEvent;

    const x : number = lBounds.right - lPoint.clientX;
    const y : number = lPoint.clientY - lBounds.top;

    console.log(`x: ${x}, y: ${y}`);

    return { x, y};
}

const KEY_LOCAL_STORAGE_LOCATION_UPVOTE_COUNT : string = "LOCATION_UPVOTE_COUNT";
const KEY_LOCAL_STORAGE_LOCATION_DOWNVOTE_COUNT : string = "LOCATION_DOWNVOTE_COUNT";
const KEY_FONT_SIZE_COUNT : string = "FONT_SIZE_COUNT";

function Home() 
{
    const [ stCountDownvotes, setCountDownvotes ] = useState<number>(14053);
    const [ stCountUpvotes, setCountUpvotes ] = useState<number>(45320);

    const [ stHighlightUpvoteSide, setHighlightUpvoteSide ] = useState<boolean>(false);
    const [ stHighlightDownvoteSide, setHighlightDownvoteSide ] = useState<boolean>(false);

    const [ stFontSize, setFontSize ] = useState<number>(18);

    const [ stSetTextLocation, setSetTextLocation ] = useState<boolean>(false);

    const [ stLocationDownvoteCount, setLocationDownvoteCount ] = useState<Location>({ x: 0, y: 0 });

    const [ stLocationUpvoteCount, setLocationUpvoteCount ] = useState<Location>({ x: 0, y: 0 });

    useEffect(
        () =>
        {
            setLocationDownvoteCount(
                utils.getFromLocalStorageTyped(KEY_LOCAL_STORAGE_LOCATION_DOWNVOTE_COUNT, isLocation) || { x: 0, y: 0 }
            );

            setLocationUpvoteCount(
                utils.getFromLocalStorageTyped(KEY_LOCAL_STORAGE_LOCATION_UPVOTE_COUNT, isLocation) || { x: 0, y: 0 }
            );

            setFontSize(
                utils.getFromLocalStorageTyped(KEY_FONT_SIZE_COUNT, (pData : unknown): pData is number => Number.isFinite(pData)) || 17
            );
        },
        []
    );

    const lPlaySound = useCallback(
        async (pIsUpvote : boolean) =>
        {
            let lSoundObj = new Audio(pIsUpvote ? sounds.upvote1 : sounds.downvote);

            lSoundObj.volume = 0.21

            await lSoundObj.play();
        },
        []
    );

    const onPressDownvoteSide = useCallback(
        (pEvent: ButtonStdPressEvent) =>
        {
            if (stHighlightDownvoteSide)
                return;

            if (stSetTextLocation)
            {
                const lLoc : Location = getPressLocation(pEvent);
                utils.setInLocalStorage(KEY_LOCAL_STORAGE_LOCATION_DOWNVOTE_COUNT, lLoc);
                setLocationDownvoteCount(lLoc);
                return;
            }

            lPlaySound(false);

            setHighlightDownvoteSide(true);
            
            setTimeout(() => { setHighlightDownvoteSide(false) }, 750);

            setCountDownvotes((prev) => { return ++prev; })
        },
        [ stHighlightDownvoteSide, stSetTextLocation, lPlaySound ]
    );

    const onPressUpvoteSide = useCallback(
        (pEvent: ButtonStdPressEvent) =>
        {
            if (stHighlightUpvoteSide)
                return;

            if (stSetTextLocation)
            {
                const lLoc : Location = getPressLocation(pEvent);
                utils.setInLocalStorage(KEY_LOCAL_STORAGE_LOCATION_UPVOTE_COUNT, lLoc);
                setLocationUpvoteCount(lLoc);
                return;
            }

            lPlaySound(true);

            setHighlightUpvoteSide(true);

            setTimeout(() => { setHighlightUpvoteSide(false) }, 750);

            setCountUpvotes((prev) => { return ++prev; })
        },
        [ stHighlightUpvoteSide, stFontSize, stSetTextLocation, lPlaySound ]
    );

    const changeFontSize = useCallback(
        (pIncrease : boolean) => 
            { 
                setFontSize(
                    (prev : number) =>
                    {
                        let lFontSize : number = prev;

                        if (pIncrease)
                            lFontSize = lFontSize == FONT_SIZE_MAX ? prev : prev + 1;
                        else
                            lFontSize = lFontSize == FONT_SIZE_MIN ? prev : prev - 1;

                        utils.setInLocalStorage(KEY_FONT_SIZE_COUNT, lFontSize);

                        return lFontSize;
                    }
                );
            }, 
        []
    )
    
    const onPressIncreaseFontSize = useCallback(
        () => { changeFontSize(true); }, [ changeFontSize ]
    );

    const onPressDecreaseFontSize = useCallback(
        () => { changeFontSize(false); }, [ changeFontSize ]
    );

    const styleDownvoteSide = useMemo<StylesButtonStd>(
        () =>
        {
            return {
                con: {
                    padding: 0,
                    borderRadius: 0,
                    backgroundColor: stHighlightDownvoteSide ? "#FF0000" : "#CC0000",
                    flexGrow: 1,
                    height: "100%",
                    position: "relative",
                    fontSize: stFontSize
                }
            }
        },
        [ stHighlightDownvoteSide, stFontSize ]
    );

    const styleUpvoteSide = useMemo<StylesButtonStd>(
        () =>
        {
            return {
                con: {
                    padding: 0,
                    borderRadius: 0,
                    backgroundColor: stHighlightUpvoteSide ? "#00FF00" : "#00CC00",
                    flexGrow: 1,
                    height: "100%",
                    position: "relative"
                }
            }
        },
        [ stHighlightUpvoteSide ]
    );

    const styleBtnFontSizeChange = useMemo<StylesButtonStd>(
        () =>
        {
            return {
                con: {
                    padding: 2, borderRadius: 5, border: "none", width: 25, height: 25
                }
            }
        },
        [ stHighlightUpvoteSide ]
    );

    const styleTextDownvotes = useMemo<CSSProperties>(
        () =>
        {
            return {
                color: "#000000", fontFamily: "arial", fontSize: stFontSize,
                position: "absolute", top: stLocationDownvoteCount.y, right: stLocationDownvoteCount.x,
            }
        },
        [ stFontSize, stLocationDownvoteCount ]
    );

    const styleTextUpvotes = useMemo<CSSProperties>(
        () =>
        {
            return {
                color: "#000000", fontFamily: "arial", fontSize: stFontSize,
                position: "absolute", top: stLocationUpvoteCount.y, right: stLocationUpvoteCount.x, 
            }
        },
        [ stHighlightUpvoteSide, stFontSize, stLocationUpvoteCount ]
    );

    return ( 
        <PageContainerStd
            prShowHeader = { false }
            prStyles = { stylePageConNoPadding }
        >

            <div style = {{ height: "100%", width: "100%", flexDirection: "row", position: "relative" }}>

                {/* Downvote Side */}
                <ButtonStd
                    prStyles = { styleDownvoteSide }
                    prOnPress = { onPressDownvoteSide } prIsOnDown
                >

                    <TextStd 
                        prText = { `${utils.intToCommaSeparatedString(stCountDownvotes)}` }
                        prStyle = { styleTextDownvotes }
                    />

                </ButtonStd>

                {/* Upvote Side */}
                <ButtonStd
                    prStyles = { styleUpvoteSide }
                    prOnPress = { onPressUpvoteSide } prIsOnDown
                >

                    <TextStd 
                        prText = { `${utils.intToCommaSeparatedString(stCountUpvotes)}` }
                        prStyle = { styleTextUpvotes }
                    />
                    
                </ButtonStd>

                <div style = {{ position: "absolute", bottom: 0, left: 0, flexDirection: "column", rowGap: 2, alignItems: "center" }}>

                    <CheckBoxStd
                        prIsChecked = { stSetTextLocation } prOnPress = { () => setSetTextLocation(prev => !prev) }
                        prStyle = {{ con: { borderWidth: 0, padding: 0 } }}
                        prSizeCheck = { 25 } prBorderRadiusCheck = { 5 }
                    />

                    <ButtonStd
                        prIcon = { gIconUpward }
                        prOnPress = { onPressIncreaseFontSize }
                        prStyles = { styleBtnFontSizeChange }
                    />

                    <ButtonStd
                        prIcon = { gIconDownward }
                        prOnPress = { onPressDecreaseFontSize }
                        prStyles = { styleBtnFontSizeChange }
                    />

                </div>

            </div>

        </PageContainerStd>
    );
}

export default Home;