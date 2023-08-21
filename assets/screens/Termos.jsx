import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import themeContext from '../theme/themeContext';

export default function Termos({navigation}) {
    const theme = useContext(themeContext);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            margin: 20,
        },
        title: {
            fontFamily: 'MADETOMMY',
            fontSize: 17,
            marginBottom: 15,
        },
        subtitle: {
            fontSize: 15,
            fontWeight: 'bold',
            fontFamily: 'MADETOMMY'
        },
        text: {
            fontSize: 13,
            fontFamily: 'MADETOMMY',
            textAlign: 'justify',
            color: theme.tColor
        }
    });

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
            <View>
                <Text style={styles.title}>VESTIBULARIUM — TERMOS DE USO</Text>
                <Text style={styles.subtitle}>1.0 Termos e Condições de Uso</Text>
                <Text style={styles.text}>Os presentes termos e condições de uso visam regular a utilização por você, usuário, dos serviços oferecidos pelo aplicativo "Vestibularium". Para acessar e utilizar os serviços oferecidos pelo aplicativo, pode ser necessário realizar um cadastro e fazer login na plataforma. Não nos responsabilizamos por danos a terceiros que decorram de falhas de acesso, transmissão, difusão ou disponibilização de conteúdo e de serviços do aplicativo. A oferta de serviços e/ou conteúdo desse aplicativo obedecem a critérios de acessibilidade.</Text>
                <Text style={styles.subtitle}>1.1 Termo de Aceitação</Text>
                <Text style={styles.text}>{"Ao utilizar os nossos Serviços, o usuário aceita e concorda com todos os termos e condições expostas que se encontram vigentes na data.\nAlertamos que estes Termos e Condições de Uso poderão ser modificados a qualquer momento, em virtude de alterações na legislação ou nos Serviços, em decorrência da utilização de novas ferramentas tecnológicas ou, ainda, sempre que, a exclusivo critério do Vestibularium, tais alterações se façam necessárias.\nA utilização dos Serviços online disponibilizados pelo Vestibularium por qualquer usuário implicará em expressa aceitação destes Termos e Condições de Uso."}</Text>
                <Text style={styles.subtitle}>2.0 Tratamento de Informações</Text>
                <Text style={styles.text}>{"A sua privacidade e o sigilo de suas informações são muito importantes. Tomamos os cuidados necessários para garantir a proteção de seus dados pessoais, o sigilo e o uso adequado dos seus dados pessoais.\nO Vestibularium se compromete a cumprir as normas previstas na LGPD e a realizar o tratamento de dados pessoais em conformidade com os seguintes princípios:\na) apenas para as finalidades determinadas nessa política, valendo-se da quantidade adequada de dados, pertinentes e limitados à necessidade e objetivo do tratamento;\nb) de forma transparente, sendo garantido ao titular dos dados o livre acesso, a exatidão dos dados e a sua consulta facilitada\nc) de forma segura, por meio da adoção de medidas técnicas aptas a proteger os dados pessoais, prevenir e mitigar danos decorrentes de eventual acesso não autorizado, ou de situação acidental ou ilícita de violação de dados.\nO Vestibularium realizará a gestão de dados pessoais durante o ciclo de vida destas informações; e em hipótese alguma haverá tratamento de dados para fins discriminatórios ilícitos ou abusivos."}</Text>
                <Text style={styles.subtitle}>2.1 Os dados cadastrados neste portal são criptografados.</Text>
                <Text style={styles.text}>{"O envio de mensagens ao correio eletrônico do usuário só será feito mediante aceitação do internauta ao disponibilizar seu endereço de e-mail, que poderá, a qualquer momento, requerer o cancelamento do envio de informações;\nO portal faz uso de cookies (informações enviadas pelo servidor de hospedagem do portal ao computador do usuário, para identificá-lo) para processar consultas em determinadas bases de dados e realizar operações que requeiram o controle de envio de dados pelo usuário;\nPodemos, a qualquer momento e sem aviso prévio aos usuários, alterar ou extinguir qualquer conteúdo desse portal, bem como mudar sua concepção visual e estrutura de conteúdo"}</Text>
                <Text style={styles.subtitle}>2.2 Acesso a Conteúdo Restrito e Suspensão de Acesso</Text>
                <Text style={styles.text}>{"Alguns serviços estão disponíveis em conteúdo aberto e fechado.\nA utilização dos Sites pode estar condicionada à utilização através de acesso por login e senha.\nQuando o acesso a conteúdo for restrito, será necessário prévio cadastro do usuário e o acesso ao ambiente por meio de login e senha. Considerando que você é responsável pela veracidade das informações cadastradas, informamos que o cadastro de informações falsas pode gerar inconsistência na prestação dos serviços, bem como impactar ou interromper o seu acesso.\nA qualquer tempo, sem aviso prévio, o Vestibularium poderá suspender, cancelar ou interromper o acesso aos Serviços, respeitadas as condições da legislação aplicável. O Vestibularium não se responsabiliza por eventuais danos e/ou problemas decorrentes da demora, interrupção ou bloqueio nas transmissões de dados decorrentes da conexão de internet do usuário."}</Text>
                <Text style={styles.subtitle}>3.0 Relacionamento com Terceiros</Text>
                <Text style={styles.text}>{"Esse portal contém links que levam a sites de terceiros, cujos conteúdos não são de nossa responsabilidade e sobre os quais não incide essa política de privacidade."}</Text>
                <Text style={styles.subtitle}>4.0 Responsabilidade dos Usuários</Text>
                <Text style={styles.text}>{"Vedado ao usuário transmitir ou difundir ameaças, pornografia infantil e conteúdo que induzam à violência ou a qualquer tipo de discriminação, seja ela sexual, racial, étnica, religiosa, política, etária, social;\nVedado ao usuário promover atos que contenham calúnia, injúria e difamação;\nVedado ao usuário transmitir tipos ou quantidades de dados que causem falhas em serviços ou equipamentos do portal e/ou de terceiros;\nNo caso de serviços que requeiram registro, o usuário se compromete em transmitir informações pessoais verdadeiras e completas;\nVedado ao usuário utilizar a rede para tentar e/ou realizar acesso não autorizado a dispositivos de comunicação, informação ou computação;\nVedado ao usuário distribuir, via correio eletrônico, grupos de discussão ou quaisquer outros canais interativos de participação, mensagens não solicitadas do tipo “corrente” e mensagens em massa, comerciais ou não.\nO usuário se responsabiliza pela precisão e veracidade dos dados informados e reconhece que a inconsistência destes poderá implicar a impossibilidade de acessar o Site e/ou Aplicativo, além das sanções administrativas, civis, e penais previstas na legislação brasileira, em especial na tributária e administrativa.\nO usuário assume inteira responsabilidade pela guarda, sigilo e boa utilização do Login e Chave de Acesso “senha” cadastrados.\nO Login e Chave de Acesso, em qualquer modalidade de autenticação, só poderão ser utilizados pelo usuário cadastrado, sendo expressamente proibido o compartilhamento de Login e/ou Chave de Acesso com quaisquer terceiros\nMesmo que o usuário exclua ou cancele seu cadastro no Site e/ou Aplicativo, fica ressalvada a guarda pelo Vestibularium e pelos entes conveniados das informações e/ou dados cuja manutenção seja a eles imposta em razão de obrigações normativas ou, ainda, cuja a manutenção seja necessária para cumprimento de ordem judicial, no âmbito de processos judiciais e/ou administrativos e questionamento de terceiros decorrentes das atividades desempenhadas pelo usuário no site e/ou aplicativo."}</Text>
                <Text style={styles.subtitle}>5.0 Sobre uso de cookies</Text>
                <Text style={styles.text}>{"O que são esses cookies? Tratam-se de arquivos criados pelos websites que armazenam hábitos de navegação e outras informações, ajudando a personalizar seu acesso. Exemplo: você acessa o site e visualiza um banner popup com um aviso importante e clica no botão \"Não tenho interesse\", ao fechar aquele banner o site armazena que você já visualizou e da próxima vez que entrar no site você não é mais incomodado com aquele aviso."}</Text>
                <Text style={styles.subtitle}>E não é perigoso ter minhas informações armazenadas?</Text>
                <Text style={styles.text}>Não é perigoso. Todas as suas informações coletadas em nosso site servem apenas para melhorar a sua experiência e são protegidas por nosso sistema de segurança.</Text>
                <Text style={styles.subtitle}>Não gosto de cookies, como faço para desativá-los?</Text>
                <Text style={styles.text}>É possível desativar os cookies por meio das preferências do seu dispositivo. Sem eles sua navegação pode se tornar limitada e algumas funcionalidades do aplicativo podem ficar comprometidas. Veja as definições sobre cookies em cada um dos dispositivos: iOS / Android.</Text>
                <Text style={styles.subtitle}>O que é a Lei Geral de Proteção de Dados?</Text>
                <Text style={styles.text}>{"Lei Geral de Proteção de Dados Pessoais (LGPD)\nLei 13.709 de 14.08.2018"}</Text>
                <Text style={styles.text}>{"É uma lei que estabelece regras ao uso de dados pessoais de pessoas físicas por entidades públicas e privadas. A LGPD é uma norma que garante direitos aos titulares dos dados e estabelece uma regra mínima para coleta, armazenamento, tratamento e compartilhamento de dados pessoais de pessoas físicas. As regras estabelecidas pela LGPD devem ser observadas por todos os setores do mercado: bancos, hospitais, comércios, empresas de e-commerce e também o setor público."}</Text>
                <Text style={styles.subtitle}>{"\n"}Política de Privacidade & Tratamento de dados: <TouchableOpacity onPress={() => Linking.openURL("https://vestibularium.com.br/politica")}><Text style={{color: theme.mainCol}}>vestibularium.com.br/politica</Text></TouchableOpacity></Text>
                <Text style={styles.subtitle}>Data de publicação deste documento:</Text>
                <Text style={styles.text}>29/05/23 16:40</Text>

                <TouchableOpacity style={{
                backgroundColor: theme.mainCol,
                padding: 20,
                margin: 30,
                borderRadius: 10,
                marginBottom: 10,
            }} onPress={() => navigation.navigate('Register')}>
                <Text style={{
                    fontFamily: "MADETOMMY",
                    textAlign: 'center',
                    fontSize: 15,
                    color: theme.backgroundColor,
                }}>Eu concordo e desejo prosseguir!</Text>
                </TouchableOpacity>
            </View>
            </ScrollView>
        </SafeAreaView>
    )
};