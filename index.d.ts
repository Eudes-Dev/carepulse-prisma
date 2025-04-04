declare type SearchParamsProps = {
    params: { [key: string]: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

declare interface CreateUserParams {
    name: string
    email: string
    phone: string
}
// declare interface User extends CreateUserParams {
//     $id: string
// }