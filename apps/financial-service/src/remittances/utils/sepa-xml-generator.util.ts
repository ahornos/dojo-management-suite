/**
 * @file sepa-xml-generator.util.ts
 * @description Utility to generate SEPA Direct Debit XML files (pain.008 format) for bank submission.
 */

export interface SepaBatchGenerationData {
  batchReference: string;
  executionDate: Date;
  creditorName: string;
  creditorIban: string;
  creditorBic?: string;
  items: {
    id: string;
    amount: number;
    mandateReference: string;
    signatureDate: Date;
    debtorIban: string;
    debtorName?: string;
  }[];
}

/**
 * Generates a valid SEPA XML string (pain.008.001.02) for direct debit collections.
 */
export function generateSepaXml(data: SepaBatchGenerationData): string {
  const formattedExecutionDate = data.executionDate.toISOString().split('T')[0];
  const creationDateTime = new Date().toISOString();
  
  const totalAmount = data.items.reduce((sum, item) => sum + Number(item.amount), 0).toFixed(2);
  const numberOfTransactions = data.items.length;

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pain.008.001.02" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <CstmrDrctDbtInitn>
    <GrpHdr>
      <MsgId>${data.batchReference}</MsgId>
      <CreDtTm>${creationDateTime}</CreDtTm>
      <NbOfTxs>${numberOfTransactions}</NbOfTxs>
      <CtrlSum>${totalAmount}</CtrlSum>
      <InitgPty>
        <Nm>${data.creditorName}</Nm>
      </InitgPty>
    </GrpHdr>
    <PmtInf>
      <PmtInfId>${data.batchReference}-INF</PmtInfId>
      <PmtMtd>DD</PmtMtd>
      <NbOfTxs>${numberOfTransactions}</NbOfTxs>
      <CtrlSum>${totalAmount}</CtrlSum>
      <PmtTpInf>
        <SvcLvl>
          <Cd>SEPA</Cd>
        </SvcLvl>
        <LclInstrm>
          <Cd>CORE</Cd>
        </LclInstrm>
        <SeqTp>RCUR</SeqTp>
      </PmtTpInf>
      <ReqdColltnDt>${formattedExecutionDate}</ReqdColltnDt>
      <Cdtr>
        <Nm>${data.creditorName}</Nm>
      </Cdtr>
      <CdtrAcct>
        <Id>
          <IBAN>${data.creditorIban}</IBAN>
        </Id>
      </CdtrAcct>
      <CdtrAgt>
        <FinInstnId>
          <BIC>${data.creditorBic || 'NOTPROVIDED'}</BIC>
        </FinInstnId>
      </CdtrAgt>`;

  for (const item of data.items) {
    const itemSignatureDate = new Date(item.signatureDate).toISOString().split('T')[0];
    xml += `
      <DrctDbtTxInf>
        <PmtId>
          <EndToEndId>${item.id}</EndToEndId>
        </PmtId>
        <InstdAmt Ccy="EUR">${Number(item.amount).toFixed(2)}</InstdAmt>
        <DrctDbtTx>
          <MndtRltdInf>
            <MndtId>${item.mandateReference}</MndtId>
            <DtOfSgntr>${itemSignatureDate}</DtOfSgntr>
            <AmdmntInd>false</AmdmntInd>
          </MndtRltdInf>
        </DrctDbtTx>
        <DbtrAgt>
          <FinInstnId>
            <Othr>
              <Id>NOTPROVIDED</Id>
            </Othr>
          </FinInstnId>
        </DbtrAgt>
        <Dbtr>
          <Nm>${item.debtorName || 'Dojo Member'}</Nm>
        </Dbtr>
        <DbtrAcct>
          <Id>
            <IBAN>${item.debtorIban}</IBAN>
          </Id>
        </DbtrAcct>
        <RmtInf>
          <Ustrd>Dojo Management Suite - Membership Fee</Ustrd>
        </RmtInf>
      </DrctDbtTxInf>`;
  }

  xml += `
    </PmtInf>
  </CstmrDrctDbtInitn>
</Document>`;

  return xml.trim();
}