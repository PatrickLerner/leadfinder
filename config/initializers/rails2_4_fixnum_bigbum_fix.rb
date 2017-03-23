# Rails 2.4 deprecation warning fix
Object.send(:remove_const, :Fixnum)
Object.send(:remove_const, :Bignum)
::Fixnum = Integer
::Bignum = Integer
