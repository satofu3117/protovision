from setuptools import setup, find_packages

setup(
    name="manual2video",
    version="0.1",
    package_dir={"": "src"},
    packages=find_packages(where="src"),
) 