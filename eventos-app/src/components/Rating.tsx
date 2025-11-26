import { View, Text } from 'react-native';
import { colors, fonts } from '../theme/tokens';
export function Rating({ value }: { value: number }) {
  return (
    <View style={{ flexDirection:'row', alignItems:'center', gap:6 }}>
      <Text style={[fonts.rating, { color: colors.blue }]}>★</Text>
      <Text style={fonts.rating}>{value.toFixed(1)}</Text>
    </View>
  );
}
