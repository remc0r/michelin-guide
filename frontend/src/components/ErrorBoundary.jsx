import React from 'react';
import { Button } from './ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>

                <h1 className="text-2xl font-bold text-black mb-4">
                  Oups ! Une erreur est survenue
                </h1>

                {this.state.error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left mb-6">
                    <p className="text-sm text-red-800 font-mono">
                      {this.state.error.toString()}
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  <p className="text-gray-600">
                    Une erreur inattendue s'est produite lors du chargement de la page.
                  </p>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-black mb-2">
                      Que pouvez-vous faire ?
                    </h3>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li>• Rafraîchir la page</li>
                      <li>• Vérifier votre connexion internet</li>
                      <li>• Réessayer ultérieurement</li>
                      <li>• Si l'erreur persiste, contactez le support</li>
                    </ul>
                  </div>

                  <Button
                    onClick={this.handleReset}
                    className="w-full"
                    size="lg"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Réessayer
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;