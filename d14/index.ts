/*
Rozwiąż zadanie o nazwie “whoami”. Za każdym razem, gdy pobierzesz zadanie, system zwróci Ci jedną ciekawostkę na temat pewnej osoby. Twoim zadaniem jest zbudowanie mechanizmu, który odgadnie, co to za osoba. W zadaniu chodzi o utrzymanie wątku w konwersacji z backendem. Jest to dodatkowo utrudnione przez fakt, że token ważny jest tylko 2 sekundy (trzeba go cyklicznie odświeżać!). Celem zadania jest napisania mechanizmu, który odpowiada, czy na podstawie otrzymanych hintów jest w stanie powiedzieć, czy wie, kim jest tajemnicza postać. Jeśli odpowiedź brzmi NIE, to pobierasz kolejną wskazówkę i doklejasz ją do bieżącego wątku. Jeśli odpowiedź brzmi TAK, to zgłaszasz ją do /answer/. Wybraliśmy dość ‘ikoniczną’ postać, więc model powinien zgadnąć, o kogo chodzi, po maksymalnie 5-6 podpowiedziach. Zaprogramuj mechanizm tak, aby wysyłał dane do /answer/ tylko, gdy jest absolutnie pewny swojej odpowiedzi.
*/
// import { task } from '../task-details';
import 'dotenv/config'
import { token } from '../token';
import { HumanMessage, SystemMessage } from "langchain/schema";
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { ChatOpenAI } from "langchain/chat_models/openai";
import { v4 as uuidv4 } from 'uuid';
import { QdrantClient } from '@qdrant/js-client-rest';
const argv = require('minimist')(process.argv.slice(2));

const ARCHIVE_URL = 'https://unknow.news/archiwum.json';
const COLLECTION_NAME = "ai_devs";
const qdrant = new QdrantClient({ url: 'http://localhost:6333' });
const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_KEY,
    maxConcurrency: 5
});

interface Archive {
    uuid: string;
    title: string;
    info: string;
    date: string;
    url: string;
    metadata: {
        uuid: string;
        source: string;
        title: string;
        info: string;
        date: string;
        url: string;
    }
}

const main = async () => {
    const { code, msg } = await token();

    // pobranie kolekcji z qdrant, jeśli nie istnieje to ją stwórz.
    const result = await qdrant.getCollections();
    const indexed = result.collections.find((collection) => collection.name === COLLECTION_NAME);
    if (!indexed) {
        await qdrant.createCollection(COLLECTION_NAME, { vectors: { size: 1536, distance: 'Cosine', on_disk: true } });
    }

    const collectionInfo = await qdrant.getCollection(COLLECTION_NAME);

    if (!collectionInfo.points_count) {
        const archiveJson: Archive[] = await fetch(ARCHIVE_URL).then(r => r.json()) as Archive[];

        // dopisz metadane
        const archive: any[] = archiveJson.slice(0, 300).map((item: Archive) => ({
            ...item,
            metadata: {
                uuid: uuidv4(),
                source: COLLECTION_NAME,
                title: item.title,
                info: item.info,
                date: item.date,
                url: item.url
            }
        }));

        // Generate embeddings
        const points: any[] = [];
        for (const document of archive) {
            const [embedding] = await embeddings.embedDocuments([document.title, document.info]);
            points.push({
                id: document.metadata.uuid,
                payload: document.metadata,
                vector: embedding,
            });
        }

        await qdrant.upsert(COLLECTION_NAME, {
            wait: true,
            batch: {
                ids: points.map((point) => (point.id)),
                vectors: points.map((point) => (point.vector)),
                payloads: points.map((point) => (point.payload)),
            },
        })

        console.log('Done! Dane dodane do bazy!');
    }


    if (code === 0) {
        const sendAnswer = async (text: string) => {
            const sendedAnswer = await fetch(`https://zadania.aidevs.pl/answer/${token}`, {
                method: 'POST',
                body: JSON.stringify({ answer: text })
            }).then(r => r.json());

            console.log(sendedAnswer);
        }

    } else {
        console.log(`${code} - Hmm, wystąpił jakiś błąd: 
    ${msg}`);
    }
};

main();