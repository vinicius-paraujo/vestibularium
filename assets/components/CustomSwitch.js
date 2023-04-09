import { React, useContext, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import themeContext from '../theme/themeContext';

export default function CustomSwitch({
    selectionMode,
    op1,
    op2,
    onSelect
}) {
    const theme = useContext(themeContext);
    const [getSelectionMode, setSelectionMode] = useState(selectionMode);
    const updateSwitchData = (value) => {
        setSelectionMode(value);
        onSelect(value);
    }

    return(
        <View style={{ 
            height: 40,
            width: '100%',
            backgroundColor: theme.mainCol,
            borderRadius: 10,
            borderColor: theme.borderColor,
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

                <Text style={{color: getSelectionMode == 1 ? theme.mainCol : theme.textButtonColor, fontFamily: "MADETOMMY", fontSize: 16}}>
                    {op1}
                </Text>
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
                <Text style={{color: getSelectionMode == 2 ? theme.mainCol : theme.textButtonColor, fontFamily: "MADETOMMY", fontSize: 16}}>
                    {op2}
                </Text>
            </TouchableOpacity>
        </View>
    )
};