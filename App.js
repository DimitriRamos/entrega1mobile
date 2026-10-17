/**
 * ============================================================================
 *  LENDAS DO METAL - Projeto Acadêmico React Native (Expo)
 * ============================================================================
 *  Tema: Música (bandas de heavy metal e seus integrantes)
 *  Bandas: Iron Maiden, Black Sabbath e Metallica
 *
 *  Estrutura:
 *   - Tela 1 (aba "Bandas"):     PARTE 1 (lista) + PARTE 2 (modal de detalhes)
 *   - Tela 2 (aba "Fã-Clube"):   PARTE 3 (formulário com controles)
 *
 *  Fotos das bandas e integrantes: Wikimedia Commons (licenças livres,
 *  créditos na página de cada arquivo). Capas de álbum: imagens
 *  ilustrativas do Unsplash.
 *
 *  Dependências extras (instalar antes de rodar):
 *   npx expo install @react-native-picker/picker @react-native-community/slider
 *   (para rodar na web) npx expo install react-dom react-native-web
 * ============================================================================
 */

import React, { useState, createContext, useContext } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Switch,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';

// ----------------------------------------------------------------------------
// Componente de imagem com "plano B": se a URL do Unsplash falhar,
// troca automaticamente por uma imagem do Picsum, para o app nunca
// exibir um espaço vazio.
// ----------------------------------------------------------------------------
function SafeImage({ uri, seed, style }) {
  const [src, setSrc] = useState(uri);
  const [falhou, setFalhou] = useState(false);

  return (
    <Image
      source={{ uri: src }}
      style={style}
      resizeMode="cover"
      onError={() => {
        if (!falhou) {
          setFalhou(true);
          setSrc(`https://picsum.photos/seed/${seed || 'metal'}/600/600`);
        }
      }}
    />
  );
}

// Monta a URL de uma foto do Unsplash no tamanho desejado
// (usado nas capas de álbum, que são ilustrativas)
const img = (id, w = 600) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80`;

// Monta a URL de uma foto real do Wikimedia Commons (licença livre).
// A página de cada arquivo, com autor e licença, fica em:
// https://commons.wikimedia.org/wiki/File:NOME_DO_ARQUIVO
const commons = (arquivo, w = 600) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(arquivo)}?width=${w}`;

// ============================================================================
// DADOS DAS BANDAS (PARTE 1 - lista / PARTE 2 - detalhes)
// Cada banda tem 1 banner + 5 ou 6 integrantes com foto (mínimo 6 imagens).
// Cada biografia tem mais de 35 palavras (requisito: mínimo 30).
// ============================================================================
const BANDAS = [
  // --------------------------------------------------------------------------
  // IRON MAIDEN
  // --------------------------------------------------------------------------
  {
    id: 'maiden',
    nome: 'Iron Maiden',
    banner: commons('Iron_Maiden_live_in_Madrid_13_July_2016.jpg', 1200),
    descricao:
      'Formado em Londres em 1975 pelo baixista Steve Harris, o Iron Maiden é um dos pilares da New Wave of British Heavy Metal. O som da banda combina guitarras gêmeas harmonizadas, galopes de baixo, letras inspiradas em história e literatura e shows grandiosos estrelados pelo mascote Eddie.',
    genero: 'Heavy Metal / NWOBHM',
    formacao: '1975 (Londres, Inglaterra)',
    gravadora: 'Parlophone / BMG',
    ouvintes: '≈ 10 milhões por mês (valor ilustrativo)',
    integrantes: [
      {
        id: 'm1',
        nome: 'Bruce Dickinson',
        funcao: 'Vocalista',
        foto: commons('Iron_Maiden_en_Costa_Rica_Bruce.jpg'),
        pais: 'Inglaterra (Worksop)',
        nascimento: '1958 • na banda desde 1981',
        equipamento: 'Voz e microfone sem fio',
        bio: 'Bruce Dickinson entrou no Iron Maiden em 1981 e estreou no álbum The Number of the Beast. Conhecido pelo alcance vocal impressionante e pela energia no palco, ele também é piloto de avião comercial, esgrimista, escritor e possui uma carreira solo respeitada. Deixou a banda em 1993 e retornou triunfalmente em 1999.',
        albuns: [
          { titulo: 'The Number of the Beast', ano: '1982', capa: img('1493225457124-a3eb161ffa5f', 200) },
          { titulo: 'Powerslave', ano: '1984', capa: img('1459749411175-04bf5292ceea', 200) },
        ],
      },
      {
        id: 'm2',
        nome: 'Steve Harris',
        funcao: 'Baixista e fundador',
        foto: commons('Steve-Harris-2008.jpg'),
        pais: 'Inglaterra (Leytonstone, Londres)',
        nascimento: '1956 • fundou a banda em 1975',
        equipamento: 'Baixo Fender Precision',
        bio: 'Steve Harris fundou o Iron Maiden em 1975 e é o principal compositor da banda desde o início. Seu estilo de baixo galopante, tocado com os dedos e muito presente na mixagem, virou marca registrada do grupo. Ele também lidera o projeto paralelo British Lion e é apaixonado por futebol, especialmente pelo West Ham.',
        albuns: [
          { titulo: 'Iron Maiden', ano: '1980', capa: img('1506157786151-b8491531f063', 200) },
          { titulo: 'Seventh Son of a Seventh Son', ano: '1988', capa: img('1524368535928-5b5e00ddc76b', 200) },
        ],
      },
      {
        id: 'm3',
        nome: 'Dave Murray',
        funcao: 'Guitarrista',
        foto: commons('Davemurray.jpg'),
        pais: 'Inglaterra (Edmonton, Londres)',
        nascimento: '1956 • na banda desde 1976',
        equipamento: 'Guitarra Fender Stratocaster',
        bio: 'Dave Murray entrou no Iron Maiden em 1976 e, ao lado de Steve Harris, é o único músico que tocou em todos os álbuns de estúdio da banda. Seus solos fluidos e cheios de legato, inspirados em Jimi Hendrix, contrastam com estilos mais agressivos e ajudaram a definir as famosas guitarras harmonizadas do grupo.',
        albuns: [
          { titulo: 'Killers', ano: '1981', capa: img('1514320291840-2e0a9bf2a9ae', 200) },
          { titulo: 'Piece of Mind', ano: '1983', capa: img('1498038432885-c6f3f1b912ee', 200) },
        ],
      },
      {
        id: 'm4',
        nome: 'Adrian Smith',
        funcao: 'Guitarrista',
        foto: commons('Adrian_Smith_30nov2006.jpg'),
        pais: 'Inglaterra (Hackney, Londres)',
        nascimento: '1957 • na banda desde 1980',
        equipamento: 'Guitarra Jackson',
        bio: 'Adrian Smith entrou no Iron Maiden em 1980 e compôs clássicos como Wasted Years e, em parceria com Bruce Dickinson, 2 Minutes to Midnight. Seus solos melódicos e bem estruturados são muito admirados por guitarristas. Saiu da banda em 1990 para seguir outros projetos e voltou em 1999, junto com Bruce.',
        albuns: [
          { titulo: 'Somewhere in Time', ano: '1986', capa: img('1470225620780-dba8ba36b745', 200) },
          { titulo: 'Senjutsu', ano: '2021', capa: img('1501386761578-eac5c94b800a', 200) },
        ],
      },
      {
        id: 'm5',
        nome: 'Janick Gers',
        funcao: 'Guitarrista',
        foto: commons('Janick_Gers_30nov2006.jpg'),
        pais: 'Inglaterra (Hartlepool)',
        nascimento: '1957 • na banda desde 1990',
        equipamento: 'Guitarra Fender Stratocaster',
        bio: 'Janick Gers entrou no Iron Maiden em 1990, substituindo Adrian Smith, depois de tocar na banda de Ian Gillan e no disco solo de Bruce Dickinson. Quando Adrian voltou, em 1999, Janick permaneceu, formando o trio de guitarras atual. No palco, é famoso pela energia, pelos giros e por arremessar a guitarra.',
        albuns: [
          { titulo: 'Fear of the Dark', ano: '1992', capa: img('1459749411175-04bf5292ceea', 200) },
          { titulo: 'Brave New World', ano: '2000', capa: img('1493225457124-a3eb161ffa5f', 200) },
        ],
      },
      {
        id: 'm6',
        nome: 'Nicko McBrain',
        funcao: 'Baterista',
        foto: commons('Nicko_McBrain_2.jpg'),
        pais: 'Inglaterra (Hackney, Londres)',
        nascimento: '1952 • na banda desde 1982',
        equipamento: 'Bateria com pedal simples de bumbo',
        bio: 'Nicko McBrain entrou no Iron Maiden em 1982 e estreou no álbum Piece of Mind. Ficou famoso por tocar com um pedal simples de bumbo, conseguindo velocidade impressionante sem pedal duplo. Bem-humorado e querido pelos fãs, anunciou em dezembro de 2024 sua aposentadoria das turnês, encerrando mais de quatro décadas na estrada.',
        albuns: [
          { titulo: 'Piece of Mind', ano: '1983', capa: img('1524368535928-5b5e00ddc76b', 200) },
          { titulo: 'The Book of Souls', ano: '2015', capa: img('1506157786151-b8491531f063', 200) },
        ],
      },
    ],
  },

  // --------------------------------------------------------------------------
  // BLACK SABBATH
  // --------------------------------------------------------------------------
  {
    id: 'sabbath',
    nome: 'Black Sabbath',
    banner: commons('Black_Sabbath,_original_lineup_(1973).JPG', 1200),
    descricao:
      'Formado em Birmingham em 1968, o Black Sabbath é considerado o criador do heavy metal. Riffs lentos e pesados, afinações graves e letras sombrias sobre guerra, religião e o sobrenatural definiram um som que influenciou praticamente todas as bandas de metal que vieram depois. A formação clássica se despediu dos palcos em 2025.',
    genero: 'Heavy Metal / Doom Metal',
    formacao: '1968 (Birmingham, Inglaterra)',
    gravadora: 'Vertigo / Warner Bros.',
    ouvintes: '≈ 15 milhões por mês (valor ilustrativo)',
    integrantes: [
      {
        id: 's1',
        nome: 'Ozzy Osbourne',
        funcao: 'Vocalista',
        foto: commons('Ozzy_Osbourne_1973.JPG'),
        pais: 'Inglaterra (Aston, Birmingham)',
        nascimento: '1948–2025 • fundador em 1968',
        equipamento: 'Voz',
        bio: 'Ozzy Osbourne foi a voz original do Black Sabbath e um dos nomes mais icônicos da história do rock. Demitido em 1979, construiu uma carreira solo de enorme sucesso e ficou famoso também pelo reality show The Osbournes. Fez sua despedida dos palcos em julho de 2025, em Birmingham, e morreu semanas depois, aos 76 anos.',
        albuns: [
          { titulo: 'Black Sabbath', ano: '1970', capa: img('1468164016595-6108e4c60c8b', 200) },
          { titulo: 'Paranoid', ano: '1970', capa: img('1514320291840-2e0a9bf2a9ae', 200) },
        ],
      },
      {
        id: 's2',
        nome: 'Tony Iommi',
        funcao: 'Guitarrista e fundador',
        foto: commons('Tony_Iommi_HAH_Katowice_Spodek_2007.jpg'),
        pais: 'Inglaterra (Birmingham)',
        nascimento: '1948 • fundador em 1968',
        equipamento: 'Guitarra Gibson SG',
        bio: 'Tony Iommi é o guitarrista e o único integrante presente em todas as formações do Black Sabbath. Aos 17 anos, perdeu as pontas de dois dedos em um acidente numa fábrica e passou a usar próteses caseiras e afinações mais baixas, o que ajudou a criar o som pesado e sombrio que definiu o heavy metal.',
        albuns: [
          { titulo: 'Master of Reality', ano: '1971', capa: img('1459749411175-04bf5292ceea', 200) },
          { titulo: 'Sabbath Bloody Sabbath', ano: '1973', capa: img('1498038432885-c6f3f1b912ee', 200) },
        ],
      },
      {
        id: 's3',
        nome: 'Geezer Butler',
        funcao: 'Baixista e letrista',
        foto: commons('Geezer_Butler_Black_Sabbath_(51412969437).jpg'),
        pais: 'Inglaterra (Aston, Birmingham)',
        nascimento: '1949 • fundador em 1968',
        equipamento: 'Baixo elétrico',
        bio: 'Geezer Butler é o baixista do Black Sabbath e o autor da maior parte das letras da banda, abordando temas como guerra, religião, ocultismo e problemas sociais. Seu baixo pesado, muitas vezes dobrando os riffs de Tony Iommi, deu ao grupo uma sonoridade densa e foi referência para inúmeros baixistas do metal.',
        albuns: [
          { titulo: 'Vol. 4', ano: '1972', capa: img('1506157786151-b8491531f063', 200) },
          { titulo: '13', ano: '2013', capa: img('1493225457124-a3eb161ffa5f', 200) },
        ],
      },
      {
        id: 's4',
        nome: 'Bill Ward',
        funcao: 'Baterista',
        foto: commons('Bill_Ward_(1973)_(cropped).JPG'),
        pais: 'Inglaterra (Aston, Birmingham)',
        nascimento: '1948 • fundador em 1968',
        equipamento: 'Bateria acústica',
        bio: 'Bill Ward foi o baterista da formação original do Black Sabbath. Com forte influência do jazz e das big bands, trouxe um balanço único para riffs lentos e pesados, criando grooves marcantes em músicas como War Pigs. Ficou fora da reunião de 2012, mas voltou a tocar com a formação clássica no show de despedida de 2025.',
        albuns: [
          { titulo: 'Paranoid', ano: '1970', capa: img('1524368535928-5b5e00ddc76b', 200) },
          { titulo: 'Sabotage', ano: '1975', capa: img('1470225620780-dba8ba36b745', 200) },
        ],
      },
      {
        id: 's5',
        nome: 'Ronnie James Dio',
        funcao: 'Vocalista (1979–1982)',
        foto: commons('Ronnie_James_Dio_HAH_Katowice.jpg'),
        pais: 'Estados Unidos (Portsmouth, New Hampshire)',
        nascimento: '1942–2010 • na banda a partir de 1979',
        equipamento: 'Voz',
        bio: 'Ronnie James Dio substituiu Ozzy Osbourne em 1979 e estreou no álbum Heaven and Hell, que revitalizou a carreira da banda. Dono de uma voz poderosa e de letras inspiradas em fantasia, popularizou o famoso gesto dos chifres no metal. Também liderou as bandas Rainbow e Dio, e morreu em 2010, aos 67 anos.',
        albuns: [
          { titulo: 'Heaven and Hell', ano: '1980', capa: img('1501386761578-eac5c94b800a', 200) },
          { titulo: 'Mob Rules', ano: '1981', capa: img('1429962714451-bb934ecdc4ec', 200) },
        ],
      },
    ],
  },

  // --------------------------------------------------------------------------
  // METALLICA
  // --------------------------------------------------------------------------
  {
    id: 'metallica',
    nome: 'Metallica',
    banner: commons('Metallica_Live_at_The_O2,_London,_England,_22_October_2017.jpg', 1200),
    descricao:
      'Fundado em Los Angeles em 1981 por James Hetfield e Lars Ulrich, o Metallica ajudou a criar o thrash metal com riffs rápidos, músicas longas e estruturas complexas. Com o Black Album, de 1991, alcançou o grande público e se tornou uma das bandas de rock mais vendidas e influentes da história.',
    genero: 'Thrash Metal / Heavy Metal',
    formacao: '1981 (Los Angeles, EUA)',
    gravadora: 'Blackened Recordings',
    ouvintes: '≈ 25 milhões por mês (valor ilustrativo)',
    integrantes: [
      {
        id: 't1',
        nome: 'James Hetfield',
        funcao: 'Vocalista e guitarrista base',
        foto: commons('James_Hetfield_Madrid_2009.jpg'),
        pais: 'Estados Unidos (Downey, Califórnia)',
        nascimento: '1963 • fundador em 1981',
        equipamento: 'Guitarra ESP',
        bio: 'James Hetfield fundou o Metallica em 1981 ao lado de Lars Ulrich e é o vocalista, guitarrista base e principal letrista da banda. Sua palhetada para baixo, rápida e precisa, virou referência no thrash metal. Ao longo dos anos, também falou abertamente sobre sua luta contra o vício, inspirando muitos fãs.',
        albuns: [
          { titulo: 'Master of Puppets', ano: '1986', capa: img('1468164016595-6108e4c60c8b', 200) },
          { titulo: 'Metallica (Black Album)', ano: '1991', capa: img('1459749411175-04bf5292ceea', 200) },
        ],
      },
      {
        id: 't2',
        nome: 'Lars Ulrich',
        funcao: 'Baterista e fundador',
        foto: commons('Lars_Ulrich_by_Gage_Skidmore.jpg'),
        pais: 'Dinamarca (Gentofte)',
        nascimento: '1963 • fundador em 1981',
        equipamento: 'Bateria Tama',
        bio: 'Lars Ulrich nasceu na Dinamarca, mudou-se para os Estados Unidos ainda adolescente e fundou o Metallica com James Hetfield após publicar um anúncio em um jornal. Além de baterista, cuida de boa parte dos negócios da banda e ficou conhecido pelo processo contra o Napster, em 2000, sobre a pirataria digital de músicas.',
        albuns: [
          { titulo: 'Ride the Lightning', ano: '1984', capa: img('1514320291840-2e0a9bf2a9ae', 200) },
          { titulo: '72 Seasons', ano: '2023', capa: img('1540039155733-5bb30b53aa14', 200) },
        ],
      },
      {
        id: 't3',
        nome: 'Kirk Hammett',
        funcao: 'Guitarrista solo',
        foto: commons('Kirk_Hammett_2017.jpg'),
        pais: 'Estados Unidos (São Francisco, Califórnia)',
        nascimento: '1962 • na banda desde 1983',
        equipamento: 'Guitarra ESP com pedal wah-wah',
        bio: 'Kirk Hammett entrou no Metallica em 1983, substituindo Dave Mustaine, e é o guitarrista solo da banda desde então. Foi aluno de Joe Satriani e é conhecido pelo uso marcante do pedal wah-wah. Fora dos palcos, é um grande colecionador de objetos de filmes de terror, paixão que já virou até exposição em museu.',
        albuns: [
          { titulo: 'Kill ’Em All', ano: '1983', capa: img('1498038432885-c6f3f1b912ee', 200) },
          { titulo: '...And Justice for All', ano: '1988', capa: img('1506157786151-b8491531f063', 200) },
        ],
      },
      {
        id: 't4',
        nome: 'Robert Trujillo',
        funcao: 'Baixista',
        foto: commons('Robert_Trujillo_by_Gage_Skidmore.jpg'),
        pais: 'Estados Unidos (Santa Monica, Califórnia)',
        nascimento: '1964 • na banda desde 2003',
        equipamento: 'Baixo elétrico tocado com os dedos',
        bio: 'Robert Trujillo entrou no Metallica em 2003, após tocar no Suicidal Tendencies e na banda solo de Ozzy Osbourne. Seu estilo agressivo, tocado com os dedos, e sua postura marcante no palco, andando agachado, rapidamente conquistaram os fãs. Estreou em estúdio com a banda no álbum Death Magnetic, lançado em 2008.',
        albuns: [
          { titulo: 'Death Magnetic', ano: '2008', capa: img('1524368535928-5b5e00ddc76b', 200) },
          { titulo: 'Hardwired... to Self-Destruct', ano: '2016', capa: img('1470225620780-dba8ba36b745', 200) },
        ],
      },
      {
        id: 't5',
        nome: 'Cliff Burton',
        funcao: 'Baixista (1982–1986)',
        foto: commons('Cliff_Burton_-_by_Fruggo.jpg'),
        pais: 'Estados Unidos (Castro Valley, Califórnia)',
        nascimento: '1962–1986 • na banda de 1982 a 1986',
        equipamento: 'Baixo Rickenbacker 4001',
        bio: 'Cliff Burton foi o baixista do Metallica entre 1982 e 1986 e gravou os três primeiros álbuns da banda. Com formação em música clássica e uso de pedais de distorção e wah-wah no baixo, criou peças marcantes como Orion. Morreu em 1986, aos 24 anos, em um acidente com o ônibus da turnê na Suécia.',
        albuns: [
          { titulo: 'Ride the Lightning', ano: '1984', capa: img('1493225457124-a3eb161ffa5f', 200) },
          { titulo: 'Master of Puppets', ano: '1986', capa: img('1429962714451-bb934ecdc4ec', 200) },
        ],
      },
    ],
  },
];

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

// Paletas de cores do app. O "Modo noturno de palco" (Switch no cabeçalho)
// alterna entre elas e o tema é compartilhado com todas as telas via Context.
const TEMAS = {
  claro: {
    fundo: '#f2f2f2',
    card: '#ffffff',
    texto: '#1a1a1a',
    textoSec: '#333333',
    sub: '#666666',
    borda: '#d0d0d0',
    seta: '#444444',
  },
  escuro: {
    fundo: '#0d0d0d',
    card: '#1c1c1e',
    texto: '#f5f5f5',
    textoSec: '#d6d6d6',
    sub: '#a0a0a0',
    borda: '#333333',
    seta: '#bbbbbb',
  },
};
const TemaContext = createContext(TEMAS.claro);

export default function App() {
  // Navegação por abas no topo: 'bandas' (Tela 1) ou 'fa' (Tela 2)
  const [abaAtiva, setAbaAtiva] = useState('bandas');
  // Banda escolhida no seletor (fica guardada mesmo ao trocar de aba)
  const [bandaId, setBandaId] = useState(BANDAS[0].id);
  // Modo noturno de palco: vale para o app inteiro
  const [modoNoturno, setModoNoturno] = useState(false);
  const tema = modoNoturno ? TEMAS.escuro : TEMAS.claro;

  return (
    <TemaContext.Provider value={tema}>
      <View style={[styles.app, { backgroundColor: tema.fundo }]}>
        <StatusBar barStyle="light-content" backgroundColor="#111" />

        {/* Cabeçalho do app */}
        <View style={styles.header}>
          <Text style={styles.headerTitulo}>🤘 Lendas do Metal</Text>
          <Text style={styles.headerSub}>Iron Maiden • Black Sabbath • Metallica</Text>

          {/* Switch do modo noturno, disponível em qualquer tela */}
          <View style={styles.headerToggle}>
            <Text style={styles.headerToggleTexto}>
              {modoNoturno ? '🌙 Modo noturno de palco' : '☀️ Modo claro'}
            </Text>
            <Switch
              value={modoNoturno}
              onValueChange={setModoNoturno}
              trackColor={{ false: '#666', true: '#e57368' }}
              thumbColor={modoNoturno ? VERMELHO : '#f4f3f4'}
              activeThumbColor={VERMELHO}
            />
          </View>
        </View>

        {/* Abas de navegação entre as 2 telas */}
        <View style={styles.abas}>
          <TouchableOpacity
            style={[styles.aba, abaAtiva === 'bandas' && styles.abaAtiva]}
            onPress={() => setAbaAtiva('bandas')}
          >
            <Text style={[styles.abaTexto, abaAtiva === 'bandas' && styles.abaTextoAtivo]}>
              Bandas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.aba, abaAtiva === 'fa' && styles.abaAtiva]}
            onPress={() => setAbaAtiva('fa')}
          >
            <Text style={[styles.abaTexto, abaAtiva === 'fa' && styles.abaTextoAtivo]}>
              Fã-Clube & Customização
            </Text>
          </TouchableOpacity>
        </View>

        {abaAtiva === 'bandas' ? (
          <TelaBandas bandaId={bandaId} setBandaId={setBandaId} />
        ) : (
          <TelaFaClube onVoltarInicio={() => setAbaAtiva('bandas')} />
        )}
      </View>
    </TemaContext.Provider>
  );
}

// ============================================================================
// TELA 1 - BANDAS (PARTE 1 + PARTE 2)
// ============================================================================
function TelaBandas({ bandaId, setBandaId }) {
  const t = useContext(TemaContext);
  // Integrante selecionado para abrir no Modal (PARTE 2)
  const [selecionado, setSelecionado] = useState(null);
  const banda = BANDAS.find((b) => b.id === bandaId);

  // Estilos que mudam com o tema
  const cardT = { backgroundColor: t.card, borderColor: t.borda };
  const tituloT = { color: t.texto };
  const textoT = { color: t.textoSec };
  const subT = { color: t.sub };

  return (
    <>
      {/* Seletor de banda (interação extra entre as listas) */}
      <View style={styles.seletor}>
        {BANDAS.map((b) => (
          <TouchableOpacity
            key={b.id}
            style={[styles.chip, b.id === bandaId && styles.chipAtivo]}
            onPress={() => setBandaId(b.id)}
          >
            <Text style={[styles.chipTexto, b.id === bandaId && styles.chipTextoAtivo]}>
              {b.nome}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{ backgroundColor: t.fundo }} contentContainerStyle={styles.conteudo}>
        {/* ---------- PARTE 1: Card principal da banda ---------- */}
        {/* key força recriar a imagem ao trocar de banda */}
        <View style={[styles.card, cardT]} key={banda.id}>
          <SafeImage uri={banda.banner} seed={`${banda.id}-banner`} style={styles.banner} />
          <View style={styles.cardCorpo}>
            <Text style={[styles.titulo, tituloT]}>{banda.nome}</Text>
            <Text style={[styles.texto, textoT]}>{banda.descricao}</Text>
          </View>
        </View>

        {/* ---------- PARTE 1: Card de metadados ---------- */}
        <View style={[styles.card, styles.cardInfo, cardT]}>
          <InfoLinha rotulo="Gênero" valor={banda.genero} />
          <InfoLinha rotulo="Formação" valor={banda.formacao} />
          <InfoLinha rotulo="Gravadora" valor={banda.gravadora} />
          <InfoLinha rotulo="Ouvintes mensais" valor={banda.ouvintes} />
        </View>

        {/* ---------- PARTE 1: Lista de integrantes ---------- */}
        <Text style={[styles.secao, tituloT]}>Integrantes</Text>
        {banda.integrantes.map((item) => (
          // PARTE 2: o toque no item abre o Modal de detalhes
          <TouchableOpacity
            key={item.id}
            style={[styles.itemLista, cardT]}
            activeOpacity={0.7}
            onPress={() => setSelecionado(item)}
          >
            <SafeImage uri={item.foto} seed={item.id} style={styles.avatar} />
            <View style={styles.itemTextos}>
              <Text style={[styles.itemNome, tituloT]}>{item.nome}</Text>
              <Text style={[styles.itemFuncao, subT]}>{item.funcao}</Text>
            </View>
            <Text style={[styles.seta, { color: t.seta }]}>›</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ---------- PARTE 2: Modal de detalhes do integrante ---------- */}
      <Modal
        visible={selecionado !== null}
        animationType="slide"
        onRequestClose={() => setSelecionado(null)}
      >
        {selecionado && (
          <View style={[styles.app, { backgroundColor: t.fundo }]}>
            {/* Botão no topo para fechar e voltar */}
            <View style={styles.modalTopo}>
              <TouchableOpacity onPress={() => setSelecionado(null)} style={styles.botaoVoltar}>
                <Text style={styles.botaoVoltarTexto}>←  Voltar</Text>
              </TouchableOpacity>
              <Text style={styles.modalTopoTitulo}>{banda.nome}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.conteudo}>
              {/* Foto ampliada + nome + biografia */}
              <View style={[styles.card, cardT]}>
                <SafeImage uri={selecionado.foto} seed={selecionado.id} style={styles.fotoGrande} />
                <View style={styles.cardCorpo}>
                  <Text style={[styles.titulo, tituloT]}>{selecionado.nome}</Text>
                  <Text style={styles.funcaoDestaque}>{selecionado.funcao}</Text>
                  <Text style={[styles.texto, textoT]}>{selecionado.bio}</Text>
                </View>
              </View>

              {/* Metadados do integrante */}
              <View style={[styles.card, styles.cardInfo, cardT]}>
                <InfoLinha rotulo="País de origem" valor={selecionado.pais} />
                <InfoLinha rotulo="Nascimento / estreia" valor={selecionado.nascimento} />
                <InfoLinha rotulo="Equipamento" valor={selecionado.equipamento} />
              </View>

              {/* Sub-lista de álbuns em destaque */}
              <Text style={styles.secaoDestaque}>Álbuns em Destaque</Text>
              {selecionado.albuns.map((album, i) => (
                <View key={i} style={[styles.itemLista, cardT]}>
                  <SafeImage
                    uri={album.capa}
                    seed={`album-${selecionado.id}-${i}`}
                    style={styles.capaAlbum}
                  />
                  <View style={styles.itemTextos}>
                    <Text style={[styles.itemNome, tituloT]}>{album.titulo}</Text>
                    <Text style={[styles.itemFuncao, subT]}>{album.ano}</Text>
                  </View>
                  <Text style={[styles.seta, { color: t.seta }]}>♪</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </Modal>
    </>
  );
}

// Linha reutilizável de "Rótulo: valor" para os cards de metadados
function InfoLinha({ rotulo, valor }) {
  const t = useContext(TemaContext);
  return (
    <Text style={[styles.infoLinha, { color: t.textoSec }]}>
      <Text style={[styles.infoRotulo, { color: t.texto }]}>{rotulo}: </Text>
      {valor}
    </Text>
  );
}

// ============================================================================
// TELA 2 - FÃ-CLUBE & CUSTOMIZAÇÃO (PARTE 3)
// ============================================================================
const ESTADO_INICIAL = {
  nome: '',
  email: '',
  musica: '',
  comentario: '',
  ingresso: 'pista',
  audio: 'atmos',
  antecedencia: 15,
  avaliacao: 5,
  avaliacaoBanda: 'maiden', // banda escolhida para avaliar
  avaliacaoAlbum: null, // melhor álbum escolhido
  avaliacoes: [], // lista de { banda, album, nota } já adicionadas
  notificacoes: true,
  sorteio: false,
};

const NOMES_INGRESSO = {
  pista: 'Pista Comum',
  premium: 'Pista Premium',
  vip: 'Camarote VIP',
};

const NOMES_AUDIO = {
  atmos: 'Dolby Atmos',
  flac: 'Hi-Res FLAC',
  padrao: 'Streaming Padrão',
};

// Lista os álbuns de uma banda (sem repetir), em ordem de lançamento,
// a partir dos álbuns em destaque de cada integrante
function albunsDaBanda(bandaId) {
  const banda = BANDAS.find((b) => b.id === bandaId);
  const mapa = {};
  banda.integrantes.forEach((m) =>
    m.albuns.forEach((a) => {
      mapa[a.titulo] = a.ano;
    })
  );
  return Object.keys(mapa)
    .map((titulo) => ({ titulo, ano: mapa[titulo] }))
    .sort((a, b) => a.ano - b.ano);
}

function TelaFaClube({ onVoltarInicio }) {
  const tema = useContext(TemaContext);
  const [form, setForm] = useState(ESTADO_INICIAL);
  // Pop-up de feedback: null = fechado; senão { tipo, titulo, mensagem }
  const [popup, setPopup] = useState(null);

  // Atualiza um campo do formulário
  const atualizar = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }));

  // Troca a banda a ser avaliada (e limpa o álbum escolhido)
  const escolherBandaAvaliacao = (id) =>
    setForm((f) => ({ ...f, avaliacaoBanda: id, avaliacaoAlbum: null }));

  // Adiciona (ou substitui) a avaliação do melhor álbum da banda escolhida
  const adicionarAvaliacao = () => {
    if (!form.avaliacaoAlbum) {
      setPopup({
        tipo: 'erro',
        titulo: 'Escolha um álbum',
        mensagem: 'Selecione o melhor álbum da banda antes de adicionar a avaliação.',
      });
      return;
    }
    const nova = {
      banda: form.avaliacaoBanda,
      album: form.avaliacaoAlbum,
      nota: form.avaliacao,
    };
    // Cada banda tem um único "melhor álbum": se já existir, é substituído
    setForm((f) => ({
      ...f,
      avaliacoes: [...f.avaliacoes.filter((a) => a.banda !== nova.banda), nova],
      avaliacaoAlbum: null,
      avaliacao: 5,
    }));
  };

  const removerAvaliacao = (bandaId) =>
    setForm((f) => ({ ...f, avaliacoes: f.avaliacoes.filter((a) => a.banda !== bandaId) }));

  const nomeBanda = (id) => BANDAS.find((b) => b.id === id).nome;

  // ---------- Botão 1: submeter com feedback (alerta) ----------
  const enviar = () => {
    if (!form.nome.trim() || !form.email.trim()) {
      setPopup({
        tipo: 'erro',
        titulo: 'Campos obrigatórios',
        mensagem: 'Preencha pelo menos o nome e o e-mail para se inscrever.',
      });
      return;
    }
    setPopup({
      tipo: 'sucesso',
      titulo: 'Inscrição recebida com sucesso!',
      mensagem:
        `Bem-vindo(a) ao fã-clube, ${form.nome.trim()}! 🤘\n\n` +
        `Nome: ${form.nome}\n` +
        `E-mail: ${form.email}\n` +
        `Música favorita: ${form.musica || '—'}\n` +
        `Comentário: ${form.comentario || '—'}\n\n` +
        `Ingresso: ${NOMES_INGRESSO[form.ingresso]}\n` +
        `Áudio: ${NOMES_AUDIO[form.audio]}\n` +
        `Aviso de novos shows: ${Math.round(form.antecedencia)} dias antes\n` +
        `Avaliações:\n${
          form.avaliacoes.length
            ? form.avaliacoes
                .map((a) => `  • ${nomeBanda(a.banda)} — ${a.album}: ${a.nota.toFixed(1)}/10`)
                .join('\n')
            : '  nenhuma'
        }\n` +
        `Notificações: ${form.notificacoes ? 'Sim' : 'Não'}\n` +
        `Sorteio Meet & Greet: ${form.sorteio ? 'Participando' : 'Não'}`,
    });
  };

  // ---------- Botão 2: limpar/resetar tudo ----------
  const limpar = () => {
    setForm(ESTADO_INICIAL);
    setPopup({
      tipo: 'info',
      titulo: 'Formulário limpo',
      mensagem: 'Todos os campos voltaram ao padrão.',
    });
  };

  const estiloInput = [
    styles.input,
    { backgroundColor: tema.card, color: tema.texto, borderColor: tema.borda },
  ];
  const estiloRotulo = [styles.rotulo, { color: tema.texto }];
  const estiloCard = [styles.card, styles.cardForm, { backgroundColor: tema.card, borderColor: tema.borda }];

  return (
    <ScrollView
      style={{ backgroundColor: tema.fundo }}
      contentContainerStyle={styles.conteudo}
      keyboardShouldPersistTaps="handled"
    >
      {/* ---------- Título ---------- */}
      <Text style={[styles.tituloForm, { color: tema.texto }]}>Fã-Clube & Customização</Text>
      <Text style={[styles.subtituloForm, { color: tema.sub }]}>
        Cadastre-se no fã-clube e personalize sua experiência.
      </Text>

      {/* ---------- 4 Inputs de texto ---------- */}
      <View style={estiloCard}>
        <Text style={estiloRotulo}>Nome completo</Text>
        <TextInput
          style={estiloInput}
          placeholder="Ex.: Ana Souza"
          placeholderTextColor={tema.sub}
          value={form.nome}
          onChangeText={(v) => atualizar('nome', v)}
        />

        <Text style={estiloRotulo}>E-mail de contato</Text>
        <TextInput
          style={estiloInput}
          placeholder="voce@email.com"
          placeholderTextColor={tema.sub}
          keyboardType="email-address"
          autoCapitalize="none"
          value={form.email}
          onChangeText={(v) => atualizar('email', v)}
        />

        <Text style={estiloRotulo}>Música favorita</Text>
        <TextInput
          style={estiloInput}
          placeholder="Ex.: Metallica - One"
          placeholderTextColor={tema.sub}
          value={form.musica}
          onChangeText={(v) => atualizar('musica', v)}
        />

        <Text style={estiloRotulo}>Comentários / relato do show</Text>
        <TextInput
          style={[estiloInput, styles.inputMulti]}
          placeholder="Conte como foi sua experiência..."
          placeholderTextColor={tema.sub}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          value={form.comentario}
          onChangeText={(v) => atualizar('comentario', v)}
        />
      </View>

      {/* ---------- 2 Pickers ---------- */}
      <View style={estiloCard}>
        <Text style={estiloRotulo}>Tipo de ingresso para a turnê</Text>
        <View style={[styles.pickerCaixa, { borderColor: tema.borda }]}>
          <Picker
            selectedValue={form.ingresso}
            onValueChange={(v) => atualizar('ingresso', v)}
            style={{ color: tema.texto, backgroundColor: tema.card }}
            dropdownIconColor={tema.texto}
          >
            <Picker.Item label="Pista Comum" value="pista" />
            <Picker.Item label="Pista Premium" value="premium" />
            <Picker.Item label="Camarote VIP" value="vip" />
          </Picker>
        </View>

        <Text style={estiloRotulo}>Formato de áudio preferido</Text>
        <View style={[styles.pickerCaixa, { borderColor: tema.borda }]}>
          <Picker
            selectedValue={form.audio}
            onValueChange={(v) => atualizar('audio', v)}
            style={{ color: tema.texto, backgroundColor: tema.card }}
            dropdownIconColor={tema.texto}
          >
            <Picker.Item label="Dolby Atmos" value="atmos" />
            <Picker.Item label="Hi-Res FLAC" value="flac" />
            <Picker.Item label="Streaming Padrão" value="padrao" />
          </Picker>
        </View>
      </View>

      {/* ---------- 2 Sliders ---------- */}
      <View style={estiloCard}>
        <Text style={estiloRotulo}>
          Notificações de novos shows: avisar{' '}
          <Text style={styles.valorDestaque}>{Math.round(form.antecedencia)} dias</Text> antes
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={30}
          step={1}
          value={form.antecedencia}
          onValueChange={(v) => atualizar('antecedencia', v)}
          minimumTrackTintColor={VERMELHO}
          maximumTrackTintColor={tema.borda}
          thumbTintColor={VERMELHO}
        />

        {/* Avaliação do melhor álbum de cada banda */}
        <View style={[styles.divisor, { backgroundColor: tema.borda }]} />
        <Text style={[styles.subtituloSecao, { color: tema.texto }]}>Avalie o melhor álbum</Text>

        <Text style={[styles.rotuloPequeno, { color: tema.sub }]}>1. Escolha a banda</Text>
        <View style={styles.linhaChips}>
          {BANDAS.map((b) => {
            const ativo = form.avaliacaoBanda === b.id;
            return (
              <TouchableOpacity
                key={b.id}
                onPress={() => escolherBandaAvaliacao(b.id)}
                style={[styles.chipForm, { borderColor: tema.borda }, ativo && styles.chipAtivo]}
              >
                <Text style={[styles.chipFormTexto, { color: ativo ? '#fff' : tema.texto }]}>
                  {b.nome}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={[styles.rotuloPequeno, { color: tema.sub }]}>2. Escolha o melhor álbum</Text>
        <View style={styles.linhaChips}>
          {albunsDaBanda(form.avaliacaoBanda).map((a) => {
            const ativo = form.avaliacaoAlbum === a.titulo;
            return (
              <TouchableOpacity
                key={a.titulo}
                onPress={() => atualizar('avaliacaoAlbum', a.titulo)}
                style={[styles.chipForm, { borderColor: tema.borda }, ativo && styles.chipAtivo]}
              >
                <Text style={[styles.chipFormTexto, { color: ativo ? '#fff' : tema.texto }]}>
                  {a.titulo} ({a.ano})
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={estiloRotulo}>
          3. Sua nota:{' '}
          <Text style={styles.valorDestaque}>{form.avaliacao.toFixed(1)}/10</Text>
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={10}
          step={0.5}
          value={form.avaliacao}
          onValueChange={(v) => atualizar('avaliacao', v)}
          minimumTrackTintColor={VERMELHO}
          maximumTrackTintColor={tema.borda}
          thumbTintColor={VERMELHO}
        />

        <TouchableOpacity style={styles.botaoAdicionar} onPress={adicionarAvaliacao} activeOpacity={0.8}>
          <Text style={styles.botaoAdicionarTexto}>＋ Adicionar avaliação</Text>
        </TouchableOpacity>

        {/* Lista das avaliações já adicionadas */}
        {form.avaliacoes.length > 0 && (
          <Text style={[styles.rotuloPequeno, { color: tema.sub, marginTop: 14 }]}>
            Suas avaliações ({form.avaliacoes.length})
          </Text>
        )}
        {form.avaliacoes.map((a) => (
          <View key={a.banda} style={[styles.itemAvaliacao, { borderColor: tema.borda }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.itemNome, { color: tema.texto }]}>{a.album}</Text>
              <Text style={[styles.itemFuncao, { color: tema.sub }]}>{nomeBanda(a.banda)}</Text>
            </View>
            <Text style={styles.notaAvaliacao}>{a.nota.toFixed(1)}</Text>
            <TouchableOpacity onPress={() => removerAvaliacao(a.banda)} style={styles.botaoRemover}>
              <Text style={[styles.botaoRemoverTexto, { color: tema.sub }]}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* ---------- 2 Switches ---------- */}
      <View style={estiloCard}>
        <View style={styles.linhaSwitch}>
          <Text style={[estiloRotulo, styles.rotuloSwitch]}>
            Notificações de novos lançamentos ({form.notificacoes ? 'Sim' : 'Não'})
          </Text>
          <Switch
            value={form.notificacoes}
            onValueChange={(v) => atualizar('notificacoes', v)}
            trackColor={{ false: '#888', true: '#e57368' }}
            thumbColor={form.notificacoes ? VERMELHO : '#f4f3f4'}
            activeThumbColor={VERMELHO}
          />
        </View>

        <View style={styles.linhaSwitch}>
          <Text style={[estiloRotulo, styles.rotuloSwitch]}>
            Participar do sorteio de Meet & Greet ({form.sorteio ? 'Sim' : 'Não'})
          </Text>
          <Switch
            value={form.sorteio}
            onValueChange={(v) => atualizar('sorteio', v)}
            trackColor={{ false: '#888', true: '#e57368' }}
            thumbColor={form.sorteio ? VERMELHO : '#f4f3f4'}
            activeThumbColor={VERMELHO}
          />
        </View>
      </View>

      {/* ---------- 2 Botões interativos ---------- */}
      <TouchableOpacity style={styles.botaoPrincipal} onPress={enviar} activeOpacity={0.8}>
        <Text style={styles.botaoPrincipalTexto}>Enviar inscrição</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.botaoSecundario, { borderColor: tema.borda }]}
        onPress={limpar}
        activeOpacity={0.8}
      >
        <Text style={[styles.botaoSecundarioTexto, { color: tema.texto }]}>Limpar formulário</Text>
      </TouchableOpacity>

      {/* ---------- Pop-up de feedback dos botões ---------- */}
      <Modal
        visible={popup !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setPopup(null)}
      >
        <View style={styles.popupFundo}>
          {popup && (
            <View style={[styles.popupCaixa, { backgroundColor: tema.card }]}>
              <Text style={styles.popupIcone}>
                {popup.tipo === 'sucesso' ? '✅' : popup.tipo === 'erro' ? '⚠️' : '🧹'}
              </Text>
              <Text
                style={[
                  styles.popupTitulo,
                  { color: popup.tipo === 'sucesso' ? '#27ae60' : tema.texto },
                ]}
              >
                {popup.titulo}
              </Text>
              <Text style={[styles.popupMensagem, { color: tema.textoSec }]}>
                {popup.mensagem}
              </Text>
              <TouchableOpacity
                style={styles.botaoPrincipal}
                onPress={() => {
                  setPopup(null);
                  // Após o sucesso, limpa o formulário e volta para a tela inicial
                  if (popup.tipo === 'sucesso') {
                    setForm(ESTADO_INICIAL);
                    onVoltarInicio();
                  }
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.botaoPrincipalTexto}>
                  {popup.tipo === 'sucesso' ? 'Voltar para o início' : 'OK'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </ScrollView>
  );
}

// ============================================================================
// ESTILOS
// ============================================================================
const VERMELHO = '#c0392b';

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : Platform.OS === 'ios' ? 44 : 0,
  },

  // Cabeçalho e abas
  header: {
    backgroundColor: '#111',
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  headerTitulo: { color: '#fff', fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  headerSub: { color: '#bbb', fontSize: 13, marginTop: 2, textAlign: 'center' },
  headerToggle: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  headerToggleTexto: { color: '#ddd', fontSize: 13, marginRight: 8 },
  abas: { flexDirection: 'row', backgroundColor: '#111' },
  aba: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  abaAtiva: { borderBottomColor: VERMELHO },
  abaTexto: { color: '#999', fontSize: 14, fontWeight: '600' },
  abaTextoAtivo: { color: '#fff' },

  // Seletor de banda
  seletor: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: '#1c1c1e',
  },
  chip: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#555',
    margin: 4,
  },
  chipAtivo: { backgroundColor: VERMELHO, borderColor: VERMELHO },
  chipTexto: { color: '#ccc', fontSize: 13, fontWeight: '600' },
  chipTextoAtivo: { color: '#fff' },

  // Containers
  conteudo: { padding: 14, paddingBottom: 40 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  cardCorpo: { padding: 14 },
  cardInfo: { padding: 14 },
  cardForm: { padding: 14 },

  // Imagens
  banner: { width: '100%', height: 190 },
  fotoGrande: { width: '100%', height: 300 },
  avatar: { width: 54, height: 54, borderRadius: 27, backgroundColor: '#ccc' },
  capaAlbum: { width: 54, height: 54, borderRadius: 8, backgroundColor: '#ccc' },

  // Tipografia
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 6 },
  texto: { fontSize: 14, color: '#333', lineHeight: 21, textAlign: 'justify' },
  funcaoDestaque: { fontSize: 14, color: VERMELHO, fontWeight: '600', marginBottom: 8 },
  infoLinha: { fontSize: 14, color: '#333', marginVertical: 3 },
  infoRotulo: { fontWeight: 'bold', color: '#1a1a1a' },
  secao: { fontSize: 20, fontWeight: 'bold', color: '#1a1a1a', marginVertical: 8 },
  secaoDestaque: {
    fontSize: 17,
    fontWeight: 'bold',
    color: VERMELHO,
    textAlign: 'center',
    marginVertical: 8,
  },

  // Itens de lista
  itemLista: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
  itemTextos: { flex: 1, marginLeft: 12 },
  itemNome: { fontSize: 16, fontWeight: '600', color: '#1a1a1a' },
  itemFuncao: { fontSize: 13, color: '#666', marginTop: 3 },
  seta: { fontSize: 26, color: '#444', paddingHorizontal: 6 },

  // Modal
  modalTopo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  botaoVoltar: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: VERMELHO,
  },
  botaoVoltarTexto: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  modalTopoTitulo: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginLeft: 14 },

  // Formulário
  tituloForm: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginTop: 4 },
  subtituloForm: { fontSize: 14, textAlign: 'center', marginTop: 4, marginBottom: 14 },
  rotulo: { fontSize: 14, fontWeight: '600', marginTop: 8, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    fontSize: 15,
  },
  inputMulti: { minHeight: 100 },
  pickerCaixa: { borderWidth: 1, borderRadius: 10, overflow: 'hidden', marginBottom: 4 },
  slider: { width: '100%', height: 40 },
  valorDestaque: { color: VERMELHO, fontWeight: 'bold' },
  linhaSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  rotuloSwitch: { flex: 1, marginRight: 10, marginTop: 0, marginBottom: 0 },

  // Botões
  botaoPrincipal: {
    backgroundColor: VERMELHO,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 6,
  },
  botaoPrincipalTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  botaoSecundario: {
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 10,
  },
  botaoSecundarioTexto: { fontSize: 16, fontWeight: 'bold' },

  // Avaliações de álbuns
  divisor: { height: 1, marginVertical: 14 },
  subtituloSecao: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  rotuloPequeno: { fontSize: 13, fontWeight: '600', marginTop: 8, marginBottom: 6 },
  linhaChips: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -4 },
  chipForm: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 18,
    borderWidth: 1,
    margin: 4,
  },
  chipFormTexto: { fontSize: 13, fontWeight: '600' },
  botaoAdicionar: {
    borderWidth: 2,
    borderColor: VERMELHO,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 6,
  },
  botaoAdicionarTexto: { color: VERMELHO, fontSize: 15, fontWeight: 'bold' },
  itemAvaliacao: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  notaAvaliacao: { color: VERMELHO, fontSize: 18, fontWeight: 'bold', marginHorizontal: 10 },
  botaoRemover: { padding: 6 },
  botaoRemoverTexto: { fontSize: 16, fontWeight: 'bold' },

  // Pop-up
  popupFundo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  popupCaixa: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 18,
    padding: 22,
    alignItems: 'stretch',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  popupIcone: { fontSize: 46, textAlign: 'center', marginBottom: 8 },
  popupTitulo: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  popupMensagem: { fontSize: 14, lineHeight: 21, textAlign: 'left', marginBottom: 8 },
});