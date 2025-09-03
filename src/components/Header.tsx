import { Activity, Bell, Settings, Users } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import type { TabType } from "../App";

interface HeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function Header({
  activeTab,
  onTabChange,
}: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo y título */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <img src="https://media.licdn.com/dms/image/v2/C560BAQG4HEFOMYsbKw/company-logo_200_200/company-logo_200_200/0/1653592592783/excelec_international_sas_logo?e=2147483647&v=beta&t=a2y1GKhjDJM7-JwuCr8u_c_sLcxwpsPGRmOoWyYJ1gI" alt="" srcset="" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  ExcelecManagment
                </h1>
                <p className="text-xs text-gray-500">
                  Centro de Monitoreo
                </p>
              </div>
            </div>
          </div>

          {/* Navegación principal */}
          <nav className="hidden md:flex items-center space-x-1">
            <Button
              variant={
                activeTab === "dashboard" ? "default" : "ghost"
              }
              className={
                activeTab === "dashboard"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "text-gray-700 hover:text-green-700 hover:bg-green-50"
              }
              onClick={() => onTabChange("dashboard")}
            >
              Dashboard
            </Button>
            <Button
              variant={
                activeTab === "servicios" ? "default" : "ghost"
              }
              className={
                activeTab === "servicios"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "text-gray-700 hover:text-green-700 hover:bg-green-50"
              }
              onClick={() => onTabChange("servicios")}
            >
              Servicios
            </Button>
            <Button
              variant={
                activeTab === "alertas" ? "default" : "ghost"
              }
              className={
                activeTab === "alertas"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "text-gray-700 hover:text-green-700 hover:bg-green-50"
              }
              onClick={() => onTabChange("alertas")}
            >
              Alertas
            </Button>
            <Button
              variant={
                activeTab === "reportes" ? "default" : "ghost"
              }
              className={
                activeTab === "reportes"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "text-gray-700 hover:text-green-700 hover:bg-green-50"
              }
              onClick={() => onTabChange("reportes")}
            >
              Reportes
            </Button>
          </nav>

          {/* Acciones del usuario */}
          <div className="flex items-center space-x-3">
            {/* Estado general */}
            <div className="hidden sm:flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm text-gray-600">
                  4/5 Online
                </span>
              </div>
            </div>

            {/* Notificaciones */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="relative"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-red-500 hover:bg-red-600">
                  3
                </Badge>
              </Button>
            </div>

            {/* Usuarios activos */}
            <div className="hidden sm:block">
              <Button variant="ghost" size="sm">
                <Users className="w-5 h-5 text-gray-600" />
              </Button>
            </div>

            {/* Configuración */}
            <Button variant="ghost" size="sm">
              <Settings className="w-5 h-5 text-gray-600" />
            </Button>

            {/* Usuario */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  EX
                </span>
              </div>
              <div className="hidden lg:block">
                <div className="text-sm font-medium text-gray-900">
                  Excelec
                </div>
                <div className="text-xs text-gray-500">
                  excelec@excelec.com
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}