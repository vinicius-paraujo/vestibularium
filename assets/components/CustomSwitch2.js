import { React, useContext, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import themeContext from '../theme/themeContext';

export default function CustomSwitch2({
    selectionMode,
    op1,
    op2,
    onSelect,
    larg
}) {
    const theme = useContext(themeContext);
    const [getSelectionMode, setSelectionMode] = useState(selectionMode);
    const updateSwitchData = (value) => {
        setSelectionMode(value);
        onSelect(value);
    }

    if (theme.theme == "dark" && getSelectionMode !== 2) setSelectionMode(2);
    return(
        <View style={{ 
            height: 40,
            width: larg == null ? "50%" : '80%',
            backgroundColor: theme.mainCol,
            borderRadius: 10,
            borderColor: "#000",
            flexDirection: "row",
            justfiyContent: "center",
            marginVertical: 10,
        }}>
            <TouchableOpacity
            style={{
                flex: .5,
                backgroundColor: getSelectionMode == 1 ? theme.textButtonColor : theme.mainCol,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10}}
                activeOpacity={1}
                onPress={() => updateSwitchData(1)}>
                <Ionicons name={op1} color={getSelectionMode == 2 ? theme.borderColor : theme.mainCol} size={24} style={{marginRight: 5}} />
            </TouchableOpacity>

            <TouchableOpacity
            style={{
                flex: .5,
                backgroundColor: getSelectionMode == 2 ? theme.textButtonColor : theme.mainCol,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10}}
                activeOpacity={1}
                onPress={() => updateSwitchData(2)}>
                <Ionicons name={op2} color={getSelectionMode == 1 ? theme.backgroundColor : theme.backgroundColor} size={24} style={{marginRight: 5}} />
            </TouchableOpacity>
        </View>
    )
};