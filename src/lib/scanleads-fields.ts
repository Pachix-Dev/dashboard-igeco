export const scanLeadFields = [
    { key: 'name', width: 26 },
    { key: 'paternSurname', width: 30 },
    { key: 'email', width: 36 },
    { key: 'company', width: 32 },
    { key: 'position', width: 28 },
    { key: 'phone', width: 20 },
    { key: 'municipality', width: 24 },
    { key: 'state', width: 24 },
    { key: 'postalCode', width: 18 },
    { key: 'country', width: 22 },
] as const;

type ScanLeadField = typeof scanLeadFields[number]['key'];

export function getScanLeadValue(lead: Record<string, unknown>, field: ScanLeadField): string {
    const value = field === 'name'
        ? lead.name || lead.speaker_name
        : field === 'paternSurname'
            ? lead.paternSurname || lead.lastname
            : lead[field];

    return value === null || value === undefined ? '' : String(value);
}
