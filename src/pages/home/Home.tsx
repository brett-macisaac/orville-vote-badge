import { useMemo, useCallback, useState, CSSProperties, useEffect } from 'react';

import { 
    spacingN, CheckBoxStd, PageContainerStd, NavButtonProps, useTheme, StylesCheckBoxStd, ComboBoxStd, StylesComboBoxStd, TextStd,
    ButtonStd, ButtonStdPressEvent, PopUpProps, StylesButtonStd,
    useWindowSize, utils,
    IconFunc, 
} from "@/standard_ui/standard_ui";

import ArrowUp from '@mui/icons-material/ArrowUpward';
import ArrowDown from '@mui/icons-material/ArrowDownward';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

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

const gIconLeft : IconFunc = (pSize : number, pColour : string) =>
{
    return <ArrowLeftIcon sx = {{ color: pColour, fontSize: pSize }} />
};

const gIconRight : IconFunc = (pSize : number, pColour : string) =>
{
    return <ArrowRightIcon sx = {{ color: pColour, fontSize: pSize }} />
};

const gIconAdd : IconFunc = (pSize : number, pColour : string) =>
{
    return <AddIcon sx = {{ color: pColour, fontSize: pSize }} />
};

const gIconSubtract : IconFunc = (pSize : number, pColour : string) =>
{
    return <RemoveIcon sx = {{ color: pColour, fontSize: pSize }} />
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
const KEY_LOCAL_STORAGE_WIDTH_TEXT_BOX : string = "WIDTH_TEXT_BOX";
const KEY_LOCAL_STORAGE_HEIGHT_TEXT_BOX : string = "HEIGHT_TEXT_BOX";

type BADGE_SIDE = "UP_VOTE" | "DOWN_VOTE"

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

function Home() 
{
    const [ stCountDownvotes, setCountDownvotes ] = useState<number>(14053);
    const [ stCountUpvotes, setCountUpvotes ] = useState<number>(45320);

    const [ stHighlightUpvoteSide, setHighlightUpvoteSide ] = useState<boolean>(false);
    const [ stHighlightDownvoteSide, setHighlightDownvoteSide ] = useState<boolean>(false);

    const [ stFontSize, setFontSize ] = useState<number>(18);

    const [ stSetFontSize, setSetFontSize ] = useState<boolean>(false);
    const [ stSetTextLocation, setSetTextLocation ] = useState<boolean>(false);
    const [ stSetWidthBox, setSetWidthBox ] = useState<boolean>(false);
    const [ stSetHeightBox, setSetHeightBox ] = useState<boolean>(false);
    const [ stSetChangeBy10, setSetChangeBy10 ] = useState<boolean>(false);

    const [ stLocationDownvoteCount, setLocationDownvoteCount ] = useState<Location>({ x: 0, y: 0 });

    const [ stLocationUpvoteCount, setLocationUpvoteCount ] = useState<Location>({ x: 0, y: 0 });

    const [ stWidthTextBox, setWidthTextBox ] = useState<number>(20);
    const [ stHeightTextBox, setHeightTextBox ] = useState<number>(20);

    const [ stLastSideClicked, setLastSideClicked ] = useState<BADGE_SIDE>("UP_VOTE");

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

            setWidthTextBox(
                utils.getFromLocalStorageTyped(KEY_LOCAL_STORAGE_WIDTH_TEXT_BOX, (pData : unknown): pData is number => Number.isFinite(pData)) || 150
            );

            setHeightTextBox(
                utils.getFromLocalStorageTyped(KEY_LOCAL_STORAGE_HEIGHT_TEXT_BOX, (pData : unknown): pData is number => Number.isFinite(pData)) || 35
            );
        },
        []
    );

    useEffect(
        () =>
        {
            utils.setInLocalStorage(KEY_FONT_SIZE_COUNT, stFontSize);
        },
        [ stFontSize ]
    );

    useEffect(
        () =>
        {
            utils.setInLocalStorage(KEY_LOCAL_STORAGE_WIDTH_TEXT_BOX, stWidthTextBox);
        },
        [ stWidthTextBox ]
    );

    useEffect(
        () =>
        {
            utils.setInLocalStorage(KEY_LOCAL_STORAGE_HEIGHT_TEXT_BOX, stHeightTextBox);
        },
        [ stHeightTextBox ]
    );

    useEffect(
        () =>
        {
            utils.setInLocalStorage(KEY_LOCAL_STORAGE_LOCATION_UPVOTE_COUNT, stLocationUpvoteCount);
        },
        [ stLocationUpvoteCount ]
    );

    useEffect(
        () =>
        {
            utils.setInLocalStorage(KEY_LOCAL_STORAGE_LOCATION_DOWNVOTE_COUNT, stLocationDownvoteCount);
        },
        [ stLocationDownvoteCount ]
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
            setLastSideClicked("DOWN_VOTE");

            if (stHighlightDownvoteSide)
                return;

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
            setLastSideClicked("UP_VOTE");

            if (stHighlightUpvoteSide)
                return;

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

    const onPressChangeBoxLocation = useCallback(
        (pDirection : Direction) => 
        { 
            const lAmountToChange : number = stSetChangeBy10 ? 10 : 1;

            const lMoveLocation = (pLocation : Location) : Location => 
            {
                const lLocation : Location = { x: pLocation.x, y: pLocation.y };

                if (pDirection == "LEFT")
                    lLocation.x += lAmountToChange;
                else if (pDirection == "RIGHT")
                    lLocation.x -= lAmountToChange;
                else if (pDirection == "DOWN")
                    lLocation.y += lAmountToChange;
                else if (pDirection == "UP")
                    lLocation.y -= lAmountToChange;

                return lLocation;
            }

            if (stLastSideClicked == "UP_VOTE")
            {
                setLocationUpvoteCount(
                    (prev) =>
                    {
                        return lMoveLocation(prev);
                    }
                );
            }
            else
            {
                setLocationDownvoteCount(
                    (prev) =>
                    {
                        return lMoveLocation(prev);
                    }
                );
            }
        }, 
        [ stLastSideClicked, stSetChangeBy10 ]
    );

    const onPressIncreaseBoxDimension = useCallback(
        () => 
        { 
            const lAmountToIncrease : number = stSetChangeBy10 ? 10 : 1;

            if (stSetHeightBox)
            {
                setHeightTextBox(
                    prev => 
                    {
                        const lHeight : number = prev + lAmountToIncrease;

                        setFontSize(lHeight / 2);

                        return lHeight;
                    }
                );
            }
            else
            {
                setWidthTextBox(prev => prev + lAmountToIncrease);
            }
        }, 
        [ stSetHeightBox, stSetChangeBy10 ]
    );

    const onPressDecreaseBoxDimension = useCallback(
        () => 
        { 
            const lAmountToDecrease : number = stSetChangeBy10 ? 10 : 1;

            if (stSetHeightBox)
            {
                setHeightTextBox(
                    prev => 
                    {
                        const lHeight : number = prev - lAmountToDecrease;

                        setFontSize(lHeight / 2);

                        return lHeight;
                    }
                );
            }
            else
            {
                setWidthTextBox(prev => prev - lAmountToDecrease);
            }
        }, 
        [ stSetHeightBox, stSetChangeBy10 ]
    );

    const styleDownvoteSide = useMemo<StylesButtonStd>(
        () =>
        {
            return {
                con: {
                    padding: 0,
                    borderRadius: 0,
                    backgroundColor: stHighlightDownvoteSide ? "#FF0000" : "#A20000",
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
                    backgroundColor: stHighlightUpvoteSide ? "#00FF00" : "#00A300",
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
                    padding: 2, borderRadius: 5, border: "none", width: 35, height: 35
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
                justifyContent: "center", alignItems: "center",
                position: "absolute", top: stLocationDownvoteCount.y, right: stLocationDownvoteCount.x,
                height: stHeightTextBox, width: stWidthTextBox, 
                border: (stSetHeightBox || stSetWidthBox || stSetTextLocation) ? "1px solid white" : "none"
            }
        },
        [ stFontSize, stLocationDownvoteCount, stWidthTextBox, stHeightTextBox, stSetHeightBox, stSetWidthBox, stSetTextLocation ]
    );

    const styleTextUpvotes = useMemo<CSSProperties>(
        () =>
        {
            return {
                color: "#000000", fontFamily: "arial", fontSize: stFontSize,
                justifyContent: "center", alignItems: "center",
                position: "absolute", top: stLocationUpvoteCount.y, right: stLocationUpvoteCount.x, 
                height: stHeightTextBox, width: stWidthTextBox, 
                border: (stSetHeightBox || stSetWidthBox || stSetTextLocation) ? "1px solid white" : "none"
            }
        },
        [ stHighlightUpvoteSide, stFontSize, stLocationUpvoteCount, stWidthTextBox, stHeightTextBox, stSetHeightBox, stSetWidthBox, stSetTextLocation ]
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

                <div style = {{ position: "absolute", bottom: 0, left: 0, flexDirection: "column", rowGap: 12, alignItems: "center" }}>

                    <CheckBoxStd
                        prIsChecked = { stSetFontSize } prOnPress = { () => setSetFontSize(prev => !prev) }
                        prStyle = {{ con: { borderWidth: 0, padding: 0 } }}
                        prSizeCheck = { 35 } prBorderRadiusCheck = { 5 }
                    />

                    <CheckBoxStd
                        prIsChecked = { stSetTextLocation } prOnPress = { () => setSetTextLocation(prev => !prev) }
                        prStyle = {{ con: { borderWidth: 0, padding: 0 } }}
                        prSizeCheck = { 35 } prBorderRadiusCheck = { 5 }
                    />

                    <CheckBoxStd
                        prIsChecked = { stSetHeightBox } prOnPress = { () => { setSetHeightBox(prev => !prev); setSetWidthBox(false); } }
                        prStyle = {{ con: { borderWidth: 0, padding: 0 } }}
                        prSizeCheck = { 35 } prBorderRadiusCheck = { 5 }
                    />

                    <CheckBoxStd
                        prIsChecked = { stSetWidthBox } prOnPress = { () => { setSetWidthBox(prev => !prev); setSetHeightBox(false); } }
                        prStyle = {{ con: { borderWidth: 0, padding: 0 } }}
                        prSizeCheck = { 35 } prBorderRadiusCheck = { 5 }
                    />

                    {
                        (stSetHeightBox || stSetWidthBox) && (
                            <>
                                <ButtonStd
                                    prIcon = { gIconSubtract }
                                    prOnPress = { onPressDecreaseBoxDimension }
                                    prStyles = { styleBtnFontSizeChange }
                                />
                                <ButtonStd
                                    prIcon = { gIconAdd }
                                    prOnPress = { onPressIncreaseBoxDimension }
                                    prStyles = { styleBtnFontSizeChange }
                                />
                            </>
                        )
                    }

                    {
                        (stSetFontSize) && (
                            <>
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
                            </>
                        )
                    }

                    {
                        (stSetTextLocation) && (
                            <>
                                <ButtonStd
                                    prIcon = { gIconUpward }
                                    prOnPress = { () => onPressChangeBoxLocation("UP") }
                                    prStyles = { styleBtnFontSizeChange }
                                />
                                <ButtonStd
                                    prIcon = { gIconDownward }
                                    prOnPress = { () => onPressChangeBoxLocation("DOWN") }
                                    prStyles = { styleBtnFontSizeChange }
                                />
                                <ButtonStd
                                    prIcon = { gIconLeft }
                                    prOnPress = { () => onPressChangeBoxLocation("LEFT") }
                                    prStyles = { styleBtnFontSizeChange }
                                />
                                <ButtonStd
                                    prIcon = { gIconRight }
                                    prOnPress = { () => onPressChangeBoxLocation("RIGHT") }
                                    prStyles = { styleBtnFontSizeChange }
                                />
                            </>
                        )
                    }

                    {
                        (stSetWidthBox || stSetHeightBox || stSetTextLocation) && (
                            <CheckBoxStd
                                prIsChecked = { stSetChangeBy10 } prOnPress = { () => setSetChangeBy10(prev => !prev) }
                                prStyle = {{ con: { borderWidth: 0, padding: 0 } }}
                                prSizeCheck = { 35 } prBorderRadiusCheck = { 5 }
                            />
                        )
                    }

                </div>

            </div>

        </PageContainerStd>
    );
}

export default Home;