import { Breadcrumb, BreadcrumbItem } from "flowbite-react";
import { HiHome } from "react-icons/hi";

export default function PageBreadcrumb({firstPage='',secondPage=''}) {
  return (
    <Breadcrumb aria-label="Default breadcrumb example">
      <BreadcrumbItem href="#" icon={HiHome}>
        Home
      </BreadcrumbItem>
      <BreadcrumbItem href="">{firstPage}</BreadcrumbItem>
      <BreadcrumbItem>{secondPage}</BreadcrumbItem>
    </Breadcrumb>
  );
}
