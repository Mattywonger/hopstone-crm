import React, { FormEvent, useState } from 'react';
import Header from './header';
import { Firebase } from '../providers/user';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { ErrorDisplay } from './Error';
import { ref, uploadBytes } from 'firebase/storage';
import { Navigate, useNavigate } from 'react-router-dom';
import { LoadingPage } from './LoadingPage';
import { useCollection } from 'react-firebase-hooks/firestore';
import { PodCollectionPath, addDeal, findPod, podLeader, usePods } from '../lib/pods';
import { UserCollectionPath, findUser, useUsers } from '../lib/users';
import { ARP, Industries, Round, Status } from '../lib/deals';
import { enumKeys, enumNums } from '../lib/utils';


const labelStyle: React.CSSProperties = {
  color: 'grey',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start'
};


const inputStyle = {
  padding: '15px',
  marginTop: '8px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)',
  width: '100%',

};

const buttonStyle = {
  padding: '15px 30px',
  border: 'none',
  borderRadius: '4px',
  background: '#007bff',
  color: 'white',
  cursor: 'pointer',
  marginTop: '8px',
  width: '100%',

};

const AddNewDeal = () => {
  const { firestore, storage } = Firebase.useContainer()

  const [users, userLoading, userError] = useUsers(firestore, UserCollectionPath)

  const [pods, podsLoading, podError] = usePods(firestore, PodCollectionPath)

  const [error, setError] = useState<Error>()

  const [writing, setWriting] = useState<boolean>(false)

  const [dealName, setName] = useState<string>("")
  const [companyName, setCompanyName] = useState<string>("")
  const [pointPerson, setPointPerson] = useState<string>("")
  const [pointPersonEmail, setPointPersonEmail] = useState<string>("")
  const [pointPersonLinkedin, setPointPersonLinkedin] = useState<string>("")

  const [pointPersonPhoto, setPointPersonPhoto] = useState<File>()
  const [arp, setARP] = useState<string>("")
  const [status, setStatus] = useState<string>("")
  const [industry, setIndustry] = useState<string>("")
  const [round, setRound] = useState<string>("")
  const [podID, setPodID] = useState<string>("")

  const [pitchDeck, setPitchDeck] = useState<File>()
  const [pitchRecording, setPitchRecording] = useState<File>()
  const [additionalFiles, setAdditionalFiles] = useState<FileList>()

  const navigate = useNavigate()

  const createDeal = (event: FormEvent) => {
    event.preventDefault()
    // TODO make this search less bad

    if (podID == "") {
      setError(Error("No Pod Selected"))
      return;
    }
    const pod = doc(firestore, PodCollectionPath, podID)

    if (pitchDeck == undefined) {
      setError(Error("No Pitch Deck!"))
      return;
    } else if (pitchRecording == undefined) {
      setError(Error("No Recording!"))
      return;
    } else if (pointPersonPhoto == undefined) {
      setError(Error("No Point Person Photo"))
      return;
    } else if (pod == null) {
      setError(Error("No pod selected"))
      return;
    } if (status == "") {
      setError(Error("No Status Selected"))
      return;
    }

    setWriting(true)

    addDoc(collection(firestore, "Deals"), {
      name: dealName,
      company: companyName,
      pointPersonName: pointPerson,
      pointPersonEmail: pointPersonEmail,
      linkedin: pointPersonLinkedin,
      arp: arp,
      status: status,
      industry: industry,
      round: round,
      pod: pod
    }).catch(setError).then(
      document => {
        console.log(document)
        if (!document) {
          throw Error("Empty Document")
        }
        let deckPath = ref(storage, `Deals/${document.id}/deck`)
        let recordingPath = ref(storage, `Deals/${document.id}/recording`)
        let photoPath = ref(storage, `Deals/${document.id}/pointPersonPhoto`)

        const additionalFilePromises = additionalFiles == undefined ? [] :
          Array.from(additionalFiles)
            .map(file => uploadBytes(ref(storage, `Deals/${document.id}/additionalFiles/${file.name}`), file))

        Promise.all([
          addDeal(pod, document),
          uploadBytes(deckPath, pitchDeck),
          uploadBytes(recordingPath, pitchRecording),
          uploadBytes(photoPath, pointPersonPhoto),
          ...additionalFilePromises
        ]).catch(setError).then(_ => navigate("/"))
      }
    ).finally(() => setWriting(false))
    //TODO is the ordering of promises reasonable here?
  }


  return (
    <>
      <Header />

      {error && <ErrorDisplay error={error} />}

      {writing || podsLoading || userLoading ? <LoadingPage /> :
        <div style={{ background: '#f0f0f0', padding: '40px', boxSizing: 'border-box', paddingTop: '100px' }}> {/* Adjusted padding to accommodate fixed header */}
          <div style={{
            maxWidth: '700px',
            margin: '0 auto',
            background: 'white',
            padding: '40px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ color: '#333', margin: '0 0 30px', fontWeight: 'bold', fontSize: '30px' }}>Deals: Add New</h2>
            <form className="add-deal-form" style={{ display: 'grid', gap: '24px' }}>
              <label style={labelStyle}>
                Deal Name
                <input type="text" name="dealName" style={inputStyle} onChange={event => setName(event.target.value)} />
              </label>
              <label style={labelStyle}>
                Company Name
                <input type="text" name="companyName" style={inputStyle} onChange={event => setCompanyName(event.target.value)} />
              </label>
              <label style={labelStyle}>
                Point Person Name
                <input type="text" name="pointPersonName" style={inputStyle} onChange={event => setPointPerson(event.target.value)} />
              </label>
              <label style={labelStyle}>
                Point Person Email
                <input type="email" name="pointPersonEmail" style={inputStyle} onChange={event => setPointPersonEmail(event.target.value)} />
              </label>
              <label style={labelStyle}>
                Point Person Linkedin
                <input type="text" name="pointPersonLinkedin" style={inputStyle} onChange={event => setPointPersonLinkedin(event.target.value)} />
              </label>
              <label style={labelStyle}>
                Point Person Photo
                <input type="file" name="pointPersonPhoto" style={inputStyle} onChange={event => setPointPersonPhoto(event.target.files ? event.target.files[0] : undefined)} />
              </label><label style={labelStyle}>
                Active, Rejected, Post Investment
                <select name="dealType" style={inputStyle} onChange={event => setARP(event.target.value)}>
                  <option value="">Select...</option>
                  {
                    enumKeys(ARP).map(key =>
                      <option value={key} key={key}>{(ARP as any)[key]}</option>
                    )
                  }
                </select>
              </label>
              <label style={labelStyle}>
                Deal Status
                <select name="dealStatus" style={inputStyle} onChange={event => setStatus(event.target.value)}>
                  <option value="">Select...</option>
                  {
                    enumKeys(Status).map(key =>
                      <option value={key} key={key}>{(Status as any)[key]}</option>
                    )
                  }

                </select>
              </label>
              <label style={labelStyle}>
                Industry
                <select name="industry" style={inputStyle} onChange={event => setIndustry(event.target.value)}>
                  <option value="">Select...</option>
                  {
                    Industries.map(industry =>
                      <option value={industry} key={industry}>{industry}</option>)
                  }
                </select>
              </label>
              <label style={labelStyle}>
                Round of Funding
                <select name="roundOfFunding" style={inputStyle} onChange={event => setRound(event.target.value)}>
                  <option value="">Select...</option>
                  {
                    enumKeys(Round).map(key =>
                      <option value={key} key={key}>{(Round as any)[key]}</option>
                    )
                  }

                </select>
              </label>
              <label style={labelStyle}>
                Pod
                <select name="pod" style={inputStyle} onChange={event => setPodID(event.target.value)}>
                  <option value="" key="">Select ...</option>
                  {
                    pods.pods.map(pod =>
                      pod.data.leader ? <option value={pod.ref.id} key={pod.ref.id}>
                        {findUser(pod.data.leader, users)?.profile.firstName}
                      </option> : <></>
                    )
                  }
                </select>
              </label>


              <label style={labelStyle}>
                Pitch Deck
                <input type="file" name="pitchDeck" style={inputStyle} onChange={event => event.target.files && setPitchDeck(event.target.files[0])} />
              </label>
              <label style={labelStyle}>
                Pitch Recording
                <input type="file" name="pitchRecording" style={inputStyle} onChange={event => event.target.files && setPitchRecording(event.target.files[0])} />
              </label>
              <label style={labelStyle}>
                Additional Files
                <input type="file" name="additionalFiles" style={inputStyle} multiple onChange={event => event.target.files && setAdditionalFiles(event.target.files)} />
              </label>

              <button type="submit" style={buttonStyle} onClick={createDeal}>Save</button>
            </form>
          </div>
        </div>}
    </>
  );
}

export default AddNewDeal;