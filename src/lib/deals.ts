import { DocumentData, DocumentReference, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions } from "firebase/firestore"

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

export enum ARP {
    Active,
    Rejected,
    PostInvestment
}

export enum Status {
    InfoCall,
    OnePager,
    DueDiligence,
    InvestmentMemo,
    LPPitching
}

export enum Round {
    PreSeed,
    Seed,
    SeriesA,
    SeriesB,
    SeriesC
}

export const dealsCollectionPath = "deals"

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