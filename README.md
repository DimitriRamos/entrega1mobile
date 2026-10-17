# 🤘 Lendas do Metal

Aplicativo mobile em **React Native (Expo)** sobre três bandas lendárias do heavy metal — **Iron Maiden**, **Black Sabbath** e **Metallica** — com seus integrantes, biografias, álbuns em destaque e um formulário de fã-clube.

Todo o código está centralizado no arquivo `App.js`.

---

## 📱 Telas

| Tela | Conteúdo |
|---|---|
| **Bandas** (Tela 1) | Seletor de banda, card com banner e descrição, card de informações (gênero, formação, gravadora, ouvintes) e lista de integrantes |
| **Detalhes do integrante** (Modal) | Foto ampliada, biografia, país de origem, nascimento/estreia, equipamento e álbuns em destaque |
| **Fã-Clube & Customização** (Tela 2) | Formulário de inscrição com inputs, pickers, sliders, switches e avaliação do melhor álbum de cada banda |

O **Modo noturno de palco**, no cabeçalho, escurece o app inteiro.

---

## ✅ Requisitos atendidos

### Parte 1 — Lista de informações com imagem e descrição
- 3 bandas, cada uma com banner, descrição e metadados.
- Listas com **5 ou 6 integrantes** por banda, cada um com foto, nome e função.
- Cada banda tem **6 ou 7 imagens** (banner + fotos dos integrantes).

### Parte 2 — Interação entre as listas
- Seletor que alterna entre as bandas.
- Ao tocar em um integrante, abre um **Modal de detalhes** com foto e biografia.
- **16 biografias**, todas com **mais de 50 palavras** (mais de 800 palavras no total).

### Parte 3 — Formulário
| Estrutura | Qtd. | Onde |
|---|---|---|
| Título | 1 | "Fã-Clube & Customização" |
| Inputs de texto | 4 | Nome, E-mail, Música favorita, Comentários |
| Picker | 2 | Tipo de ingresso, Formato de áudio |
| Slider | 2 | Antecedência do aviso de novos shows (1–30 dias), Nota do melhor álbum (0–10) |
| Switch | 2 | Notificações de lançamentos, Sorteio de Meet & Greet |
| Botões com interação | 3 | Enviar inscrição (pop-up de sucesso), Limpar formulário, Adicionar avaliação |

### Mínimo de 2 telas
- Aba **Bandas** + aba **Fã-Clube** (+ modal de detalhes).

---

## ▶️ Como rodar

Pré-requisito: [Node.js](https://nodejs.org/) instalado.

```bash
# instalar dependências
npm install

# rodar
npx expo start
```

Depois:
- **Navegador:** aperte `w` no terminal.
- **Celular:** escaneie o QR code com o app **Expo Go**.

Bibliotecas extras usadas:
- `@react-native-picker/picker`
- `@react-native-community/slider`
- `react-native-web` e `react-dom` (para rodar no navegador)

---

## 🖼️ Créditos das imagens

As fotos das bandas e dos integrantes vêm do **[Wikimedia Commons](https://commons.wikimedia.org/)**, com licenças livres. Autor e licença de cada foto estão na página do arquivo:

**Iron Maiden**
- [Iron Maiden live in Madrid 2016](https://commons.wikimedia.org/wiki/File:Iron_Maiden_live_in_Madrid_13_July_2016.jpg)
- [Bruce Dickinson](https://commons.wikimedia.org/wiki/File:Iron_Maiden_en_Costa_Rica_Bruce.jpg)
- [Steve Harris](https://commons.wikimedia.org/wiki/File:Steve-Harris-2008.jpg)
- [Dave Murray](https://commons.wikimedia.org/wiki/File:Davemurray.jpg)
- [Adrian Smith](https://commons.wikimedia.org/wiki/File:Adrian_Smith_30nov2006.jpg)
- [Janick Gers](https://commons.wikimedia.org/wiki/File:Janick_Gers_30nov2006.jpg)
- [Nicko McBrain](https://commons.wikimedia.org/wiki/File:Nicko_McBrain_2.jpg)

**Black Sabbath**
- [Black Sabbath, formação original (1973)](https://commons.wikimedia.org/wiki/File:Black_Sabbath,_original_lineup_(1973).JPG)
- [Ozzy Osbourne](https://commons.wikimedia.org/wiki/File:Ozzy_Osbourne_1973.JPG)
- [Tony Iommi](https://commons.wikimedia.org/wiki/File:Tony_Iommi_HAH_Katowice_Spodek_2007.jpg)
- [Geezer Butler](https://commons.wikimedia.org/wiki/File:Geezer_Butler_Black_Sabbath_(51412969437).jpg)
- [Bill Ward](https://commons.wikimedia.org/wiki/File:Bill_Ward_(1973)_(cropped).JPG)
- [Ronnie James Dio](https://commons.wikimedia.org/wiki/File:Ronnie_James_Dio_HAH_Katowice.jpg)

**Metallica**
- [Metallica na O2 Arena (2017)](https://commons.wikimedia.org/wiki/File:Metallica_Live_at_The_O2,_London,_England,_22_October_2017.jpg)
- [James Hetfield](https://commons.wikimedia.org/wiki/File:James_Hetfield_Madrid_2009.jpg)
- [Lars Ulrich](https://commons.wikimedia.org/wiki/File:Lars_Ulrich_by_Gage_Skidmore.jpg)
- [Kirk Hammett](https://commons.wikimedia.org/wiki/File:Kirk_Hammett_2017.jpg)
- [Robert Trujillo](https://commons.wikimedia.org/wiki/File:Robert_Trujillo_by_Gage_Skidmore.jpg)
- [Cliff Burton (ilustração)](https://commons.wikimedia.org/wiki/File:Cliff_Burton_-_by_Fruggo.jpg)

As capas de álbum são imagens ilustrativas do [Unsplash](https://unsplash.com/), não as capas oficiais.

---

Projeto acadêmico de desenvolvimento mobile.
