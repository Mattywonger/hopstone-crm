import { CollectionReference, DocumentData, DocumentReference, Firestore, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, collection } from "firebase/firestore"
import { useCollection } from "react-firebase-hooks/firestore"

type DealCollection = {
    deals: Array<Deal>,
    ref: CollectionReference
}

export type Deal = {
    data: DealData,
    ref: DocumentReference
}

export type DealData = {
    name: string,
    company: string,
    pointPersonName: string,
    pointPersonEmail: string,
    linkedIn: string,
    arp: ARP,
    status: Status,
    industry: string,
    round: Round,
    pod: DocumentReference
}

//TODO: These should be enums, but Typescript has bad support for them

export enum ARP {
    Active = "Active",
    Rejected = "Rejected",
    PostInvestment = "Post Investment"
}

export enum Status {
    OnePager = "One Pager",
    DueDiligence = "Due Diligence",
    InvestmentMemo = "Investment Memo",
    LPPitching = "LP Pitching"
}

export enum Round {
    PreSeed = "Pre Seed",
    Seed = "Seed",
    SeriesA = "Series A",
    SeriesB = "Series B",
    SeriesC = "Series C"
}

export const Industries = [
    "Real Estate",
    "Fintech",
    "Hardware",
    "AI",
    "VR",
    "Ecommerce",
    "B2B",
    "Delivery Service",
    "B2C",
    "MedTech",
    "HCIT",
    "SaaS",
    "BioTech",
    "EdTech"
]

export const dealsCollectionPath = "Deals"

export const dealsConverter: FirestoreDataConverter<Deal> = {
    toFirestore(deal: Deal): DocumentData {
        return deal.data
    },
    fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Deal {
        const data = snapshot.data(options)
        return {
            data: {
                name: data.name,
                company: data.company,
                pointPersonName: data.pointPersonName,
                pointPersonEmail: data.pointPersonEmail,
                linkedIn: data.linkedIn,
                arp: data.arp,
                status: data.status,
                industry: data.industry,
                round: data.Round,
                pod: data.pod
            },
            ref: snapshot.ref
        }
    }
}

export const useDeals = (firestore: Firestore, path: string): [DealCollection, boolean, Error | null] => {
    const dealCollection = collection(firestore, path).withConverter(dealsConverter)
    const [deals, loading, error] = useCollection(dealCollection)

    return [{ deals: deals != undefined ? deals.docs.map(deal => deal.data()) : [], ref: dealCollection }, loading, error || null]
}