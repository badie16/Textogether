// texlive.d.ts
declare module "texlive" {
	const texlive: () => Promise<any>;
	export default texlive;
}
