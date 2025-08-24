import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function IndexScreen() {
  const [fontsLoaded] = useFonts({
    fontuda: require('../../assets/fonts/SpaceGrotesk-Regular.ttf'),
    fontudo: require('../../assets/fonts/SpaceGrotesk-Bold.ttf'),
    fontai: require('../../assets/fonts/SpaceGrotesk-Regular.ttf'),
  });

  const router = useRouter();

  if (!fontsLoaded) {
    return <Text />; // loading mínimo (você pode trocar por um spinner)
  }

  const handleLogin = () => router.push('/cadlog/login');
  const handleRegister = () => router.push('/cadlog/cadastro');

  // Exemplo de imagem local (você já está usando require no seu código)
  const personImageSource = require('../../assets/images/Resolve Vereador/wpp 3.png');

  return (
    <SafeAreaView style={styles.safe}>
      {/* imagem da pessoa em camada de fundo (absoluta) */}
      <Image
        source={personImageSource}
        style={styles.personImage}
        resizeMode="cover"
        accessible={false}
      />

      {/*
        Gradiente sombra SOBRE a imagem da pessoa.
        Vai do transparente (na parte superior do gradiente) até a cor do background (na base),
        criando o efeito de fade que "integra" a pessoa com o fundo.
      */}
      <LinearGradient
        colors={['transparent', styles.safe.backgroundColor]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.personShadowGradient}
      />

      {/* header com logo */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/Resolve Vereador/Resolve Vereador 2.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* conteúdo principal: texto lateralizado (lado direito) */}
      <View style={styles.content}>
        <Text style={styles.title}>
          Seu <Text style={styles.emphasis}>representante</Text> e sua{'\n'}
          <Text style={styles.emphasis}>solução</Text> em poucos cliques
        </Text>
      </View>

      {/* botão na parte inferior */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={handleLogin} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Não tem uma conta?{' '}</Text>
          <TouchableOpacity onPress={handleRegister}>
            <Text style={styles.registerLink}>Cadastre-se</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const PADDING_H = 15;
const PERSON_WIDTH_PERCENT = 1.05; // quanto da largura a imagem da pessoa ocupa (ajustável)
const BG_COLOR = '#2f6f8f';

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG_COLOR, // fundo sólido (sem degradê). Ajuste se quiser outro tom.
  },

  // imagem da pessoa em BACK LAYER
  personImage: {
    position: 'absolute',
    left: -125,
    bottom: 0,
    width: SCREEN_WIDTH * PERSON_WIDTH_PERCENT,
    height: SCREEN_HEIGHT / 1.5,
    zIndex: 0,
  },

  /**
   * Gradient shadow: posicionado sobre a imagem da pessoa.
   * Ajuste top para controlar onde o fade inicia.
   */
  personShadowGradient: {
    position: 'absolute',
    left: -200, // mantém cobertura além da imagem (ajuste conforme necessidade)
    right: 0,
    top: SCREEN_HEIGHT * 0.50, // inicia o gradiente a partir de ~45% da altura da tela
    bottom: 0,
    zIndex: 1,
  },

  header: {
    width: '100%',
    marginTop: '35%',
    paddingTop: Platform.OS === 'android' ? 12 : 18,
    alignItems: 'center',
    zIndex: 2,
  },

  logo: {
    width: 260.75,
    height: 97.5,
  },

  // conteúdo principal ocupa a área visível à direita da imagem da pessoa
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginRight: '3%',
    zIndex: 2,
  },

  title: {
    marginTop: '10%',
    width: '58%',
    color: '#ffffff',
    fontSize: Math.round(SCREEN_WIDTH * 0.040),
    textAlign: 'right',
    lineHeight: Math.round(SCREEN_WIDTH * 0.076),
    fontFamily: 'fontuda',
  },

  emphasis: {
    fontFamily: 'fontudo',
    color: '#ffffff',
  },

  // footer fixo na base
  footer: {
    paddingHorizontal: PADDING_H,
    paddingBottom: Platform.OS === 'android' ? 24 : 30,
    zIndex: 3,
    bottom: 40,
    alignItems: "center"
  },

  button: {
    width: '80%',
    backgroundColor: '#00bcdeff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 4,
  },

  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'fontai',
  },

  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },

  registerText: {
    fontSize: 15,
    color: '#fff',
    fontFamily: 'fontuda',
  },

  registerLink: {
    fontSize: 15,
    color: '#91c6ffff',
    fontFamily: 'fontuda',
  },
});
