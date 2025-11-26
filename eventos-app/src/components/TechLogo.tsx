import { View, Text } from 'react-native';
import { techBadge, fonts, colors } from '../theme/tokens';
export function TechLogo({ label }:{ label:string }) {
  return (
    <View style={{
      width: techBadge.size, height: techBadge.size, borderRadius: techBadge.size/2,
      backgroundColor: techBadge.bg, alignItems:'center', justifyContent:'center'
    }}>
      <Text style={[fonts.caption, { color: colors.blue }]}>{label.slice(0,3)}</Text>
    </View>
  );
}
