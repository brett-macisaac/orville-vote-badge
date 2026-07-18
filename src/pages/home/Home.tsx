import { useMemo, useCallback, useState, CSSProperties, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import HistoryIcon from '@mui/icons-material/History';

import { 
    spacingN, CheckBoxStd, PageContainerStd, NavButtonProps, useTheme, StylesCheckBoxStd, ComboBoxStd, StylesComboBoxStd, TextStd,
    ButtonStd, PopUpProps, StylesButtonStd,
    useWindowSize, utils,
    IconFunc
} from "@/standard_ui/standard_ui";
import { ItemCombBoxStd } from '@/standard_ui/components/combo_box_std/ComboBoxStd';
import { Back } from "@/pages/nav_buttons";

import { stylePageTitle, stylePageConGeneral, stylePageConNoPadding } from '@/utils/styles';

import "./home.css";
import Button from '@mui/material/Button';

const gHeaderButtonsLeft : NavButtonProps[] = [ Back ];

const gIconHistory : IconFunc = (pSize : number, pColour : string) =>
{
    return <HistoryIcon sx = {{ color: pColour, fontSize: pSize }} />
};

function Home() 
{
    const windowSize = useWindowSize();

    const [ stCountDownvotes, setCountDownvotes ] = useState<number>(14053);
    const [ stCountUpvotes, setCountUpvotes ] = useState<number>(45320);

    const [ stHighlightUpvoteSide, setHighlightUpvoteSide ] = useState<boolean>(false);
    const [ stHighlightDownvoteSide, setHighlightDownvoteSide ] = useState<boolean>(false);

    useEffect(
        () =>
        {

        },
        []
    );

    const onPressDownvoteSide = useCallback(
        () =>
        {
            // todo: play sound.

            setHighlightDownvoteSide(true);
            
            setTimeout(() => { setHighlightDownvoteSide(false) }, 1500);

            setCountDownvotes((prev) => { return ++prev; })
        },
        []
    );

    const onPressUpvoteSide = useCallback(
        () =>
        {
            // todo: play sound.

            setHighlightUpvoteSide(true);
            
            setTimeout(() => { setHighlightUpvoteSide(false) }, 1500);

            setCountUpvotes((prev) => { return ++prev; })
        },
        []
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
                    position: "relative"
                }
            }
        },
        [ stHighlightDownvoteSide ]
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

    const styleTextDownvotes = useMemo<CSSProperties>(
        () =>
        {
            return {
                color: "#000000", position: "absolute", top: 30, right: 100
            }
        },
        [ stHighlightUpvoteSide ]
    );

    const styleTextUpvotes = useMemo<CSSProperties>(
        () =>
        {
            return {
                color: "#000000", position: "absolute", top: 30, right: 100
            }
        },
        [ stHighlightUpvoteSide ]
    );

    return ( 
        <PageContainerStd
            prShowHeader = { false }
            prStyles = { stylePageConNoPadding }
        >

            <div style = {{ height: "100%", width: "100%", flexDirection: "row" }}>

                {/* Downvote Side */}
                <ButtonStd
                    prStyles = { styleDownvoteSide }
                    prOnPress = { onPressDownvoteSide }
                >

                    <TextStd 
                        prText = { `${stCountDownvotes}` }
                        prStyle = { styleTextDownvotes }
                    />

                </ButtonStd>

                {/* Upvote Side */}
                <ButtonStd
                    prStyles = { styleUpvoteSide }
                    prOnPress = { onPressUpvoteSide }
                >

                    <TextStd 
                        prText = { `${stCountUpvotes}` }
                        prStyle = { styleTextUpvotes }
                    />
                    
                </ButtonStd>

                {/* todo: control that toggles the visibility of the controls that allow the user to set text size and position. */}

            </div>

        </PageContainerStd>
    );
}

export default Home;